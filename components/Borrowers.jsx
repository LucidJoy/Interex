import React, { useContext, useEffect, useState } from "react";
import { ethers } from "ethers";

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
import { useAccount } from "wagmi";
import { shortenAddress } from "@/utils/shortenAddr";

const Borrowers = () => {
  const { getAccruedInterest, getYourBorrowers } = useContext(CreditContext);

  // with earch {address} borrowers array will change using useeffect

  const [allBorrowers, setAllBorrowers] = useState([]);
  const [latestBorrower, setLatestBorrower] = useState([]);

  const { address } = useAccount();

  useEffect(() => {
    const fetchBorrowers = async () => {
      const bors = await getYourBorrowers(address);
      setAllBorrowers(bors);

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

  return (
    <div className='flex items-center justify-center flex-col mt-[50px] w-[calc(100vw-250px)] ml-[250px]'>
      <div className='text-white w-[1000px]'>
        <div className='flex flex-row justify-between items-center mb-[20px]'>
          <h3
            className='scroll-m-20 text-2xl font-semibold tracking-normal'
            onClick={() => console.log(latestBorrower)}
          >
            Borrowers
          </h3>
        </div>

        <Table>
          <TableCaption>All tokens are valued referring to INTX.</TableCaption>
          <TableHeader>
            <TableRow className='hover:bg-transparent'>
              <TableHead className='text-center'>Sl.</TableHead>
              <TableHead className='text-center'>Borrower</TableHead>
              <TableHead className='text-center'>Amount</TableHead>
              <TableHead className='text-center'>Accrued Interest</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {latestBorrower ? (
              latestBorrower.map((borrower, index) => (
                <TableRow key={index} className='text-center'>
                  <TableCell className='font-medium'>{index + 1}</TableCell>
                  <TableCell>{shortenAddress(borrower.borrower)}</TableCell>
                  <TableCell>{borrower.amount}</TableCell>
                  <TableCell>{borrower.aci}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className='text-center'>
                  No requests pending.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Borrowers;
