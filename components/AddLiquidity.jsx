import React, { useContext, useState, useEffect } from "react";
import { useContractRead } from "wagmi";
import { toast } from "sonner";
import { ethers } from "ethers";
import { useAccount } from "wagmi";

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
import Loading from "./Loading";

const AddLiquidity = () => {
  const {
    addLiquidity,
    interexPoolAddress,
    poolBalance,
    setPoolBalance,
    getTokenBalance,
    addLiquidityLoad,
  } = useContext(CreditContext);
  const { address } = useAccount();

  const [tokenAmount, setTokenAmount] = useState(1);

  const handleLiquidity = () => {
    addLiquidity(tokenAmount.toString());
  };

  const { data, isError } = useContractRead({
    address: interexPoolAddress,
    abi: interexPoolABI,
    functionName: "getTokenBalance",
    args: [interexPoolAddress],
  });

  useEffect(() => {
    data && setPoolBalance(ethers.utils.formatEther(data));
  }, [addLiquidityLoad, data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Liquidity</CardTitle>
        <CardDescription>
          Contribute your tokens to the liquidity pool and earn rewards.
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
            <p className='text-muted-foreground'>Pool TVL (INTX): </p>
            <p className='font-semibold'>{poolBalance ? poolBalance : 0}</p>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        {addLiquidityLoad ? (
          <div>
            <Loading />
          </div>
        ) : (
          <Button onClick={handleLiquidity}>Add Liquidity</Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default AddLiquidity;
