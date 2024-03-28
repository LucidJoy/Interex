import React, { createContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import { getParsedEthersError } from "@enzoferey/ethers-error-parser";
import { useAccount } from "wagmi";
import { toast } from "sonner";

import InterexPoolABI from "./InterexPool.json";
import Interex20ABI from "./Interex20.json";
import { formatLiquidityProviders } from "@/utils/formatLiquidityProviders";

export const CreditContext = createContext({});

// mumbai testnet

export const CreditProvider = ({ children }) => {
  const [poolBalance, setPoolBalance] = useState(null);
  const [allPoolLenders, setAllPoolLenders] = useState([]);
  const [queryParameter, setQueryParameter] = useState("profile");
  const [lenderBorrowerMapping, setLenderBorrowerMapping] = useState(new Map());

  // loading states
  const [addLiquidityLoad, setAddLiquidityLoad] = useState(false);
  const [borrowTokensLoad, setBorrowTokensLoad] = useState(false);
  const [repayInterestLoad, setRepayInterestLoad] = useState(false);
  const [removeLiquidityLoad, setRemoveLiquidityLoad] = useState(false);

  const interex20Address = "0x116277799cF0c53A07Dabd2660222fd98Fe0ec71";
  const interexPoolAddress = "0x6c167Ddc7E311E12C06769692627255BC916164E";

  // use effects
  useEffect(() => {
    liquidityProvidersArr();
  }, [allPoolLenders.length]);

  const addLiquidity = async (amount) => {
    try {
      if (window.ethereum) {
        setAddLiquidityLoad(true);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();

        const tokenContract = new ethers.Contract(
          interex20Address,
          Interex20ABI,
          signer
        );

        const amountToApprove = ethers.utils.parseEther(amount);
        const approvalTx = await tokenContract.approve(
          interexPoolAddress,
          amountToApprove,
          { gasLimit: 500000 }
        );
        await approvalTx.wait(1);

        const poolContract = new ethers.Contract(
          interexPoolAddress,
          InterexPoolABI,
          signer
        );

        const amountAsString = ethers.utils.parseEther(amount).toString();

        const txRes = await poolContract.addLiquidity(amountAsString, {
          gasLimit: 500000,
        });

        await txRes.wait(1);
        setAddLiquidityLoad(false);
        toast.success("Add liquidity success.");
      }
    } catch (error) {
      const parsedEthersError = getParsedEthersError(error);
      toast.error(
        `${parsedEthersError.errorCode} -> ${parsedEthersError.context}`
      );
      setAddLiquidityLoad(false);
    }
  };

  const removeLiquidity = async (lender, amount) => {
    try {
      if (window.ethereum) {
        setRemoveLiquidityLoad(true);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();

        const poolContract = new ethers.Contract(
          interexPoolAddress,
          InterexPoolABI,
          signer
        );

        const txRes = await poolContract.removeLiquidity(lender, {
          gasLimit: 500000,
        });

        await txRes.wait(1);
        setRemoveLiquidityLoad(false);
        toast.success("Liquidity removed successfully.");
      }
    } catch (error) {
      console.log(error);
      setRemoveLiquidityLoad(false);
    }
  };

  const liquidityProvidersArr = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();

        const contract = new ethers.Contract(
          interexPoolAddress,
          InterexPoolABI,
          signer
        );

        const txRes = await contract.callStatic.poolLendersArr();

        const data = formatLiquidityProviders(txRes);
        setAllPoolLenders(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getTokenBalance = async (address) => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();

        const contract = new ethers.Contract(
          interexPoolAddress,
          InterexPoolABI,
          signer
        );

        const balance = await contract.callStatic.getTokenBalance(address);
        // console.log("Token balance:", ethers.utils.formatEther(balance));
        return balance;
      }
    } catch (error) {
      const parsedEthersError = getParsedEthersError(error);
      toast.error(
        `${parsedEthersError.errorCode} -> ${parsedEthersError.context}`
      );
    }
  };

  const borrowTokens = async (lender, borrower, amount) => {
    try {
      if (window.ethereum) {
        setBorrowTokensLoad(true);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();

        const tokenContract = new ethers.Contract(
          interex20Address,
          Interex20ABI,
          signer
        );

        const amountToApprove = ethers.utils.parseEther(amount).toString();
        const approvalTx = await tokenContract.approve(
          interexPoolAddress,
          amountToApprove,
          { gasLimit: 500000 }
        );
        await approvalTx.wait(1);

        const poolContract = new ethers.Contract(
          interexPoolAddress,
          InterexPoolABI,
          signer
        );

        const amountAsString = ethers.utils.parseEther(amount).toString();
        const txRes = await poolContract.borrowTokens(
          lender,
          borrower,
          amountAsString,
          {
            gasLimit: 500000,
          }
        );

        await txRes.wait(1);
        setBorrowTokensLoad(false);
        toast.success("Borrow tokens success.");
      }
    } catch (error) {
      console.log(error);
      setBorrowTokensLoad(false);
      toast.error("Failed to borrow tokens.");
    }
  };

  const repayBorrowInterest = async (lender, borrower, amount) => {
    // borrower => approve contract => contract pay lender

    try {
      if (window.ethereum) {
        setRepayInterestLoad(true);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();

        const tokenContract = new ethers.Contract(
          interex20Address,
          Interex20ABI,
          signer
        );

        const amountToApprove = ethers.utils.parseEther(amount).toString();
        const approvalTx = await tokenContract.approve(
          interexPoolAddress,
          amountToApprove,
          { gasLimit: 500000 }
        );
        await approvalTx.wait(1);

        const poolContract = new ethers.Contract(
          interexPoolAddress,
          InterexPoolABI,
          signer
        );

        const txRes = await poolContract.repayBorrowInterest(lender, borrower, {
          gasLimit: 500000,
        });

        await txRes.wait(1);
        setRepayInterestLoad(false);
        toast.success("Interest repaid successfully.");
      }
    } catch (error) {
      console.log(error);
      setRepayInterestLoad(false);
      toast.error("Failed to repay interest.");
    }
  };

  const getPoolEarnings = async (address) => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();

        const contract = new ethers.Contract(
          interexPoolAddress,
          InterexPoolABI,
          signer
        );

        const balance = await contract.callStatic.getPoolEarnings(address);
        // console.log("Token balance:", ethers.utils.formatEther(balance));
        return balance;
      }
    } catch (error) {
      const parsedEthersError = getParsedEthersError(error);
      toast.error(
        `${parsedEthersError.errorCode} -> ${parsedEthersError.context}`
      );
    }
  };

  const getYourBorrowers = async (lender) => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();

        const contract = new ethers.Contract(
          interexPoolAddress,
          InterexPoolABI,
          signer
        );

        const borrowers = await contract.callStatic.getYourBorrowers(lender);
        return borrowers;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAccruedInterest = async (lender, borrower) => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();

        const contract = new ethers.Contract(
          interexPoolAddress,
          InterexPoolABI,
          signer
        );

        const aci = await contract.callStatic.getAccruedInterest(
          lender,
          borrower
        );
        return aci;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getYourBorrowings = async (lender) => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();

        const contract = new ethers.Contract(
          interexPoolAddress,
          InterexPoolABI,
          signer
        );

        const borrowers = await contract.callStatic.getYourBorrowings(lender);
        return borrowers;
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <CreditContext.Provider
      value={{
        interexPoolAddress,
        addLiquidity,
        liquidityProvidersArr,
        setAllPoolLenders,
        poolBalance,
        setPoolBalance,
        borrowTokens,
        addLiquidityLoad,
        setAddLiquidityLoad,
        borrowTokensLoad,
        setBorrowTokensLoad,
        getTokenBalance,
        allPoolLenders,
        getPoolEarnings,
        queryParameter,
        setQueryParameter,
        lenderBorrowerMapping,
        setLenderBorrowerMapping,
        getYourBorrowers,
        getAccruedInterest,
        getYourBorrowings,
        repayBorrowInterest,
        repayInterestLoad,
        removeLiquidity,
        removeLiquidityLoad,
      }}
    >
      {children}
    </CreditContext.Provider>
  );
};
