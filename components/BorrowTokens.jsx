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

const BorrowTokens = () => {
  const { addLiquidity, interexPoolAddress, getUsersTokenBalance } =
    useContext(CreditContext);
  const { address } = useAccount();

  const [lenderAddress, setLenderAddress] = useState("");
  const [borrowAmount, setBorrowAmount] = useState(1);
  const [lenderBalance, setLenderBalance] = useState(null);

  const { data, isError, isLoading } = useContractRead({
    address: interexPoolAddress,
    abi: interexPoolABI,
    functionName: "getTokenBalance",
    account: address,
  });

  useEffect(() => {
    setLenderBalance(ethers.utils.formatEther(data));
  }, [isLoading]);

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
            <p className='text-muted-foreground'>Lender balance (INTX): </p>
            <p className='font-semibold'>{lenderBalance}</p>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button onClick={() => console.log(ethers.utils.formatEther(data))}>
          Borrow
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BorrowTokens;
