import React, { useContext, useState, useEffect } from "react";
import { useContractRead } from "wagmi";

import interexPoolABI from "../context/InterexPool.json";
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

import { CreditContext } from "@/context/CreditContext";
import { toast } from "sonner";
import { ethers } from "ethers";

const AddLiquidity = () => {
  const { addLiquidity, interexPoolAddress, poolBalance, setPoolBalance } =
    useContext(CreditContext);

  const [tokenAmount, setTokenAmount] = useState(1);

  const handleLiquidity = () => {
    addLiquidity(tokenAmount.toString());
  };

  const { data, isError, isLoading } = useContractRead({
    address: interexPoolAddress,
    abi: interexPoolABI,
    functionName: "getTokenBalance",
    account: interexPoolAddress,
  });

  useEffect(() => {
    setPoolBalance(ethers.utils.formatEther(data));
  }, [isLoading]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Liquidity</CardTitle>
        <CardDescription>
          Change your password here. After saving, you'll be logged out.
        </CardDescription>
      </CardHeader>

      <CardContent className='space-y-2'>
        <div className='space-y-1'>
          <Label htmlFor='name'>INTX Token</Label>
          <div className='flex gap-[20px]'>
            <Input
              type='number'
              id='name'
              defaultValue='1'
              min={1}
              step={1}
              onChange={(e) => setTokenAmount(e.target.value)}
            />
          </div>
        </div>

        <p className='font-bold text-[16px] pt-[15px]'>Summary</p>

        <div className='flex items-center flex-col text-[14px] gap-[6px]'>
          <div className='flex items-center flex-row justify-between w-full'>
            <p className='text-muted-foreground'>APY rate: </p>
            <p className='font-semibold'>10%</p>
          </div>
          <div className='flex items-center flex-row justify-between w-full'>
            <p className='text-muted-foreground'>Total Value Locked (INTX): </p>
            <p
              className='font-semibold'
              onClick={() => console.log(ethers.utils.formatEther(data))}
            >
              {poolBalance}
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button onClick={handleLiquidity}>Add Liquidity</Button>
      </CardFooter>
    </Card>
  );
};

export default AddLiquidity;
