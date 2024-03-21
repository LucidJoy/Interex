// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LiquidityPool is Ownable {
    using SafeERC20 for IERC20;

    address public token;
    uint public totalLiquidity;

    struct Lender {
        address user;
        uint amountLended;
        uint poolEarnings;
        uint borrowerEarnings;
        uint depositTime;
    }

    struct Borrower {
        address user;
        uint amountBorrowed;
        uint borrowTime;
    }

    // If borrowTime > lockPeriod, start taking interest from borrowers
    uint public constant lockPeriod = 4 minutes; // 1 year lock period
    uint public constant interestRate = 10; // 10% interest rate

    mapping(address => Lender) public liquidityProviders;
    address[] lendersArrayPool;
    mapping(address => uint) public poolInterestEarnings;
    // lender => borrower => amount
    mapping(address => mapping(address => uint)) public borrowProviders;
    mapping(address => address) public lenderBorrowerMap;
    address[] public lendersArrBorrow; //all lenders that provide the borrowers

    mapping(address => Borrower) public borrowers;
    address[] borrowersArr;

    mapping(address => Borrower[]) public arr;

    mapping(address => mapping(address => uint))
        public lenderBorrowerAccruedInterest;

    event LiquidityAdded(address indexed provider, uint256 amount);
    event LiquidityRemoved(address indexed provider, uint256 amount);
    event EarningsClaimed(address indexed provider, uint256 earnings);
    event RepayBorrowInterest(
        address indexed provider,
        address borrower,
        uint256 amount
    );

    constructor(address _token) payable {
        token = _token;
    }

    function addLiquidity(uint _amount) public {
        require(_amount > 0, "Invalid amount");

        Lender storage lender = liquidityProviders[msg.sender];
        lender.user = msg.sender;

        IERC20(token).safeTransferFrom(msg.sender, address(this), _amount);
        totalLiquidity += _amount;
        lender.amountLended += _amount;
        lender.depositTime = block.timestamp;
        lendersArrayPool.push(lender.user); //push lender to array

        emit LiquidityAdded(msg.sender, _amount);
    }

    function removeLiquidity() public {
        Lender memory lender = liquidityProviders[msg.sender];
        lender.user = msg.sender;

        require(lender.amountLended > 0, "No liquidity deposited");
        require(
            block.timestamp >= lender.depositTime + lockPeriod,
            "Liquidity still locked"
        );

        // Calculate interest
        uint interest = calculateInterest();

        // Calculate total amount to transfer (including both principal and interest)
        uint totalAmount = lender.amountLended + interest;

        totalLiquidity -= lender.amountLended;
        lender.amountLended = 0;
        lender.depositTime = 0;
        poolInterestEarnings[msg.sender] -= interest;

        // Transfer total amount (including both principal and interest) to the user
        IERC20(token).safeTransfer(msg.sender, totalAmount);

        emit LiquidityRemoved(msg.sender, totalAmount);
    }

    // TODO: should increase every 1 minute
    // Provides pool interest to lenders every 1 month of 10%, provided the lender has deposited money into pool
    function providePoolInterest() public {
        for (uint i = 0; i < lendersArrayPool.length; i++) {
            // 1. Find out the amounts lended
            Lender storage lender = liquidityProviders[lendersArrayPool[i]];

            uint int_rate = (lender.amountLended * 10) / 100; //0.5

            // 2. Transfer 10% of the amount as interest
            IERC20(token).transfer(lendersArrayPool[i], int_rate);
            lender.poolEarnings += int_rate;
        }
    }

    // provide borrowing interest to lenders.. will be called every 1 min
    function provideLendInterest() public {
        // 1. Find out the borrowers of the lender
        for (uint i = 0; i < lendersArrBorrow.length; i++) {
            for (uint j = 0; j < borrowersArr.length; j++) {
                address l = lendersArrBorrow[i];
                //i => lender, j => all the borrowers of the lender
                address b = borrowersArr[j];
                uint amount = borrowProviders[l][b];

                // after lockPeriod(4 mins) is over, every 1 min interest will be calculated
                if (amount > 0) {
                    //lender will be able to check borrow interest from this b
                    calcBorrowInterest(l, b);
                }
            }
        }
    }

    // TODO: give interest from pool money
    // also give option to withdraw pool money
    function claimEarningsByPool() public {
        Lender memory lender = liquidityProviders[msg.sender];
        if (lender.amountLended == 0) {
            return;
        }

        uint256 earnings = calculateEarnings(msg.sender);
        require(earnings > 0, "No earnings to claim");

        lender.depositTime = 0;
        IERC20(token).safeTransfer(msg.sender, earnings);

        emit EarningsClaimed(msg.sender, earnings);
    }

    function calculateEarnings(address provider) public view returns (uint) {
        if (totalLiquidity == 0) {
            return 0;
        }

        Lender memory lender = liquidityProviders[provider];

        uint lockDuration = block.timestamp - lender.depositTime;

        if (lockDuration >= lockPeriod) {
            // Calculate earnings based on the provider's share of the total liquidity
            uint256 earnings = (lender.amountLended *
                IERC20(token).balanceOf(address(this))) / totalLiquidity;
            return earnings;
        } else {
            return 0;
        }
    }

    // interest thru pool
    function calculateInterest() public returns (uint) {
        Lender memory lender = liquidityProviders[msg.sender];

        uint lockDuration = block.timestamp - lender.depositTime;
        uint interest = 0;

        // Check if the lock duration exceeds the lock period
        if (lockDuration >= lockPeriod) {
            interest =
                (lender.amountLended * interestRate * lockDuration) /
                (100 * lockPeriod);
        }

        poolInterestEarnings[msg.sender] += interest;

        return interest;
    }

    // borrowers borrow tokens from lender
    function borrowTokens(address _lender, uint _amount) public {
        Lender memory lender = liquidityProviders[_lender];

        require(
            _amount <= lender.poolEarnings,
            "Not enough pool interest earnings"
        );

        Borrower storage borrower = borrowers[msg.sender];
        borrower.user = msg.sender;

        require(
            lenderBorrowerAccruedInterest[_lender][msg.sender] == 0,
            "A loan in progress"
        );

        // lender needs to APPROVE the contract
        IERC20(token).transferFrom(_lender, borrower.user, _amount);

        borrowProviders[_lender][msg.sender] += _amount;
        borrower.amountBorrowed += _amount; //amt borrowed by user
        borrower.borrowTime = block.timestamp; //time when borrowes

        lenderBorrowerMap[_lender] = msg.sender; //msg.sender => borrower
        lendersArrBorrow.push(_lender); // lenders who provides money to borrowers array
        borrowersArr.push(msg.sender); //borrowers will be pushed

        lenderBorrowerAccruedInterest[_lender][msg.sender] = 0;
    }

    // can be withdrawn by the lender = msg.sender
    // calculate borrow interest in compounding
    function calcBorrowInterest(address _lender, address _borrower) public {
        Borrower storage borrower = borrowers[_borrower];
        require(borrower.amountBorrowed > 0, "Not borrowed anything");

        uint principle = borrower.amountBorrowed;
        uint rate = 10; // 1% per min
        // time is 1 min, will be called each min by chainlink
        if (lenderBorrowerAccruedInterest[_lender][_borrower] == 0) {
            lenderBorrowerAccruedInterest[_lender][_borrower] =
                principle +
                ((principle * rate) / 100);
        } else {
            lenderBorrowerAccruedInterest[_lender][
                _borrower
            ] += ((lenderBorrowerAccruedInterest[_lender][_borrower] * rate) /
                100);
        }
    }

    // repay by borrowers
    function repayBorrowInterest(address _lender) public {
        require(borrowProviders[_lender][msg.sender] > 0, "Nothing to pay");

        Borrower storage borrower = borrowers[msg.sender];
        uint amount = borrower.amountBorrowed;

        uint interestToPay = lenderBorrowerAccruedInterest[_lender][msg.sender];
        require(
            IERC20(token).balanceOf(msg.sender) >= interestToPay,
            "Insufficient balance"
        );

        // CHECK THIS
        IERC20(token).transferFrom(msg.sender, _lender, interestToPay);

        borrowProviders[_lender][msg.sender] = 0;
        lenderBorrowerAccruedInterest[_lender][msg.sender] = 0;
        borrower.amountBorrowed -= amount;

        emit RepayBorrowInterest(_lender, msg.sender, interestToPay);
    }

    function lenderArrLength() external view returns (uint) {
        return lendersArrayPool.length;
    }

    function borrowProvidersArrLength() external view returns (uint) {
        return lendersArrBorrow.length;
    }
}
