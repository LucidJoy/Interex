import React, { useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import { toast } from "sonner";
import { RotateCw } from "lucide-react";

import { CreditContext } from "@/context/CreditContext";
import Hint from "./Hint";
import { Button } from "./ui/button";
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

const Borrowers = () => {
  const { getAccruedInterest, getYourBorrowers } = useContext(CreditContext);

  const [latestBorrower, setLatestBorrower] = useState([]);

  const { address } = useAccount();

  useEffect(() => {
    const fetchBorrowers = async () => {
      const bors = await getYourBorrowers(address);

      let newArray = [];
      for (let i = 0; i < bors.length; i++) {
        const response = await getAccruedInterest(address, bors[i][0]);
        const interest = ethers.utils.formatEther(response);
        const newObj = {
          borrower: bors[i].user,
          aci: interest,
          amount: ethers.utils.formatEther(bors[i].amountBorrowed),
        };

        newArray.push(newObj);
      }
      setLatestBorrower(newArray);
    };
    fetchBorrowers();
  }, [address]);

  // useEffect(() => {
  //   const fetchBorrowers = async () => {
  //     const bors = await getYourBorrowers(address);

  //     let newArray = [];
  //     for (let i = 0; i < bors.length; i++) {
  //       const response = await getAccruedInterest(address, bors[i][0]);
  //       const interest = ethers.utils.formatEther(response);
  //       const newObj = {
  //         borrower: bors[i].user,
  //         aci: interest,
  //         amount: ethers.utils.formatEther(bors[i].amountBorrowed),
  //       };

  //       newArray.push(newObj);
  //     }
  //     setLatestBorrower(newArray);
  //   };
  //   fetchBorrowers();
  // }, []);

  const handleRefresh = async () => {
    try {
      const bors = await getYourBorrowers(address);

      let newArray = [];
      for (let i = 0; i < bors.length; i++) {
        const response = await getAccruedInterest(address, bors[i][0]);
        const interest = ethers.utils.formatEther(response);
        const newObj = {
          borrower: bors[i].user,
          aci: interest,
          amount: ethers.utils.formatEther(bors[i].amountBorrowed),
        };

        newArray.push(newObj);
      }
      setLatestBorrower(newArray);

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
              Borrowers
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
              <TableHead className='text-center'>Borrower</TableHead>
              <TableHead className='text-center'>Amount</TableHead>
              <TableHead className='text-center'>Accrued Interest</TableHead>
              <TableHead className='text-center'>Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {latestBorrower.length > 0 &&
              latestBorrower.map((borrower, index) => (
                <TableRow key={index} className='text-center'>
                  <TableCell className='font-medium'>{index + 1}</TableCell>
                  <TableCell>{shortenAddress(borrower.borrower)}</TableCell>
                  <TableCell>{borrower.amount}</TableCell>
                  <TableCell>{borrower.aci}</TableCell>
                  <TableCell>
                    {borrower.aci == 0.0 && borrower.amount == 0.0 ? (
                      <p className='font-semibold text-green-600'>Paid</p>
                    ) : (
                      <p className='font-semibold text-red-600'>Pending</p>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Borrowers;
