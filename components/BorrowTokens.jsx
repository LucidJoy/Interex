import React, { useContext, useEffect, useState } from "react";
import { useAccount, useBalance, useContractRead } from "wagmi";
import { ethers } from "ethers";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "./ui/button";
import interexPoolABI from "../context/InterexPool.json";

import { CreditContext } from "@/context/CreditContext";
import { toast } from "sonner";
import Loading from "./Loading";
import { RotateCw } from "lucide-react";

const BorrowTokens = () => {
  const {
    borrowTokens,
    interexPoolAddress,
    borrowTokensLoad,
    getPoolEarnings,
  } = useContext(CreditContext);
  const { address } = useAccount();

  const [lenderAddress, setLenderAddress] = useState("");
  const [borrowAmount, setBorrowAmount] = useState(1);
  const [lenderPoolEarning, setLenderPoolEarning] = useState(null);

  const handleRefresh = async () => {
    try {
      // should be earnings, not balance
      const balance = await getPoolEarnings(lenderAddress);
      balance && setLenderPoolEarning(ethers?.utils?.formatEther(balance));
      toast.success("Refreshed");
    } catch (error) {
      // toast.error("Lender address invalid.");
      console.log(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Borrow Tokens</CardTitle>
        <CardDescription>
          Change your password here. After saving, you'll be logged out.
        </CardDescription>
      </CardHeader>

      <CardContent className='space-y-2'>
        <div className='space-y-1'>
          <Label htmlFor='address'>Lender Address</Label>
          <div className='flex gap-[20px]'>
            <Input
              type='text'
              id='address'
              placeholder='0xAb8...'
              min={1}
              step={1}
              onChange={(e) => setLenderAddress(e.target.value)}
            />
          </div>
        </div>

        <div className='space-y-1'>
          <Label htmlFor='name'>INTX Token</Label>
          <div className='flex gap-[20px]'>
            <Input
              type='number'
              id='name'
              defaultValue='1'
              min={1}
              step={1}
              onChange={(e) => setBorrowAmount(e.target.value)}
            />
          </div>
        </div>

        <p className='font-bold text-[16px] pt-[15px]'>Summary</p>

        <div className='flex items-center flex-col text-[14px] gap-[6px]'>
          <div className='flex items-center flex-row justify-between w-full'>
            <p className='text-muted-foreground'>APY compound rate: </p>
            <p className='font-semibold'>10%</p>
          </div>
          <div className='flex items-center flex-row justify-between w-full'>
            <div className='flex flex-row items-center justify-center gap-[10px]'>
              <p className='text-muted-foreground'>Lender balance (INTX): </p>

              <div
                className='bg-muted-foreground/30 border border-white/20 rounded-sm py-[4px] px-[6px] hover:cursor-pointer'
                onClick={() => handleRefresh()}
              >
                <button className='font-normal text-[12px] flex items-center justify-center'>
                  <RotateCw className='h-4 w-4 text-muted-foreground' />
                </button>
              </div>
            </div>

            <div className='font-semibold'>
              {lenderPoolEarning ? lenderPoolEarning : 0}
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        {borrowTokensLoad ? (
          <div>
            <Loading />
          </div>
        ) : (
          <Button onClick={() => borrowTokens(lenderAddress, borrowAmount)}>
            Borrow
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default BorrowTokens;
