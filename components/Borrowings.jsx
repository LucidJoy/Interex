import React, { useContext, useEffect, useState } from "react";
import { RotateCw } from "lucide-react";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import { toast } from "sonner";

import { CreditContext } from "@/context/CreditContext";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { shortenAddress } from "@/utils/shortenAddr";
import { Button } from "./ui/button";
import Loading from "./Loading";
import Hint from "./Hint";

const Borrowings = () => {
  const {
    getYourBorrowings,
    getAccruedInterest,
    repayBorrowInterest,
    repayInterestLoad,
  } = useContext(CreditContext);

  const [latestLender, setLatestLender] = useState([]);

  const { address } = useAccount();

  useEffect(() => {
    const fetchBorrowings = async () => {
      const bors = await getYourBorrowings(address);

      let newArr = [];
      for (let i = 0; i < bors.length; i++) {
        const res = await getAccruedInterest(bors[i].lender, address);
        const interest = ethers.utils.formatEther(res);
        const newObj = {
          lender: bors[i].lender,
          amountLended: ethers.utils.formatEther(bors[i].borrowAmt),
          aci: interest,
          isPaid: bors[i].isPaid,
        };

        newArr.push(newObj);
      }
      setLatestLender(newArr);
    };
    fetchBorrowings();
  }, [address, latestLender.length]);

  const handleRepayBorrowInterest = async (
    lenderAddr,
    borrowerAddr,
    intAmount
  ) => {
    await repayBorrowInterest(lenderAddr, borrowerAddr, intAmount.toString());
    window.location.reload();
  };

  const handleRefresh = async () => {
    try {
      const bors = await getYourBorrowings(address);

      let newArr = [];
      for (let i = 0; i < bors.length; i++) {
        const res = await getAccruedInterest(bors[i].lender, address);
        const interest = ethers.utils.formatEther(res);
        const newObj = {
          lender: bors[i].lender,
          amountLended: ethers.utils.formatEther(bors[i].borrowAmt),
          aci: interest,
          isPaid: bors[i].isPaid,
        };

        newArr.push(newObj);
      }
      setLatestLender(newArr);

      toast.success("Refreshed");
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className='flex items-center justify-center flex-col mt-[50px] w-[calc(100vw-250px)] ml-[250px]'>
      <div className='text-white w-[1000px]'>
        <div className='flex flex-row justify-between items-center mb-[20px]'>
          <div className='flex flex-row gap-[15px] items-center justify-center'>
            <h3 className='scroll-m-20 text-2xl font-semibold tracking-normal'>
              Borrowings
            </h3>

            <Hint label='Refresh' side='top' align='center' sideOffset={5}>
              <Button
                variant='refresh'
                size='icon'
                onClick={() => handleRefresh()}
              >
                <RotateCw className='h-4 w-4' />
              </Button>
            </Hint>
          </div>
        </div>

        <Table>
          <TableCaption>All tokens are valued referring to INTX.</TableCaption>
          <TableHeader>
            <TableRow className='hover:bg-transparent'>
              <TableHead className='text-center'>Sl.</TableHead>
              <TableHead className='text-center'>Lender</TableHead>
              <TableHead className='text-center'>Lend Amount</TableHead>
              <TableHead className='text-center'>Accrued Interest</TableHead>
              <TableHead className='text-center'>Repay</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {latestLender.length > 0 &&
              latestLender.map((lender, index) => (
                <TableRow key={index} className='text-center'>
                  <TableCell className='font-medium'>{index + 1}</TableCell>
                  <TableCell>{shortenAddress(lender.lender)}</TableCell>
                  <TableCell>{lender.amountLended}</TableCell>
                  <TableCell>{lender.aci}</TableCell>
                  {repayInterestLoad ? (
                    <TableCell className='flex items-center justify-center'>
                      <Loading />
                    </TableCell>
                  ) : (
                    <TableCell>
                      {lender.isPaid == false ? (
                        <Button
                          variant='green'
                          onClick={() =>
                            handleRepayBorrowInterest(
                              lender.lender,
                              address,
                              lender.aci
                            )
                          }
                        >
                          Repay
                        </Button>
                      ) : (
                        <div className='font-semibold text-green-600'>Paid</div>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Borrowings;
