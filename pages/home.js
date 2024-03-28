import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ethers } from "ethers";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CreditContext } from "@/context/CreditContext";
import { shortenAddress } from "@/utils/shortenAddr";

const Home = () => {
  const { allPoolLenders, liquidityProvidersArr } = useContext(CreditContext);

  const router = useRouter();
  console.log("hi");

  return (
    <div className='flex items-center justify-center flex-col mt-[50px]'>
      <div className='text-white w-[1000px]'>
        <div className='flex flex-row justify-between items-center mb-[20px]'>
          <h3 className='scroll-m-20 text-2xl font-semibold tracking-normal'>
            Liquidity Providers
          </h3>
          <Button onClick={() => router.push("/pool")}>Add Liquidity</Button>
        </div>

        <Table>
          <TableCaption>All tokens are valued referring to INTX.</TableCaption>
          <TableHeader>
            <TableRow className='hover:bg-transparent'>
              <TableHead className='text-center'>Sl.</TableHead>
              <TableHead className='text-center'>Address</TableHead>
              <TableHead className='text-center'>Lended</TableHead>
              <TableHead className='text-center'>Pool Yield</TableHead>
              <TableHead className='text-center'>Borrowers</TableHead>
              <TableHead className='text-center'>Revoke Liquidity</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {allPoolLenders ? (
              allPoolLenders.map((lender, idx) => (
                <TableRow className='text-center'>
                  <TableCell className='font-medium'>{idx + 1}</TableCell>
                  <TableCell>{shortenAddress(lender.lender)}</TableCell>
                  <TableCell>{lender.amountLended}</TableCell>
                  <TableCell>{lender.poolEarnings}</TableCell>
                  <TableCell>0 (HC)</TableCell>
                  <TableCell className='text-center'>
                    <Button variant='green'>Remove</Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <div>No lenders found!</div>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Home;
