import React, { useContext, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import { toast } from "sonner";
import { RotateCw } from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import Hint from "./Hint";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "./ui/button";
import { CreditContext } from "@/context/CreditContext";
import Loading from "./Loading";

const BorrowTokens = () => {
  const {
    borrowTokens,
    borrowTokensLoad,
    getPoolEarnings,
    lenderBorrowerMapping,
    setLenderBorrowerMapping,
  } = useContext(CreditContext);
  const { address } = useAccount();

  const [lenderAddress, setLenderAddress] = useState("");
  const [borrowAmount, setBorrowAmount] = useState(1);
  const [lenderPoolEarning, setLenderPoolEarning] = useState(null);

  const handleRefresh = async () => {
    try {
      if (lenderAddress.length != 42) return toast.error("Invalid address.");

      const balance = await getPoolEarnings(lenderAddress);
      balance && setLenderPoolEarning(ethers?.utils?.formatEther(balance));
      toast.success("Refreshed");
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  const handleBorrow = () => {
    try {
      const borrowerInfo = lenderBorrowerMapping.get(lenderAddress) || [];

      borrowerInfo.push({ borrower: address, amount: borrowAmount });

      setLenderBorrowerMapping(
        new Map(lenderBorrowerMapping.set(lenderAddress, borrowerInfo))
      );
      toast.success("Borrow request successful");
    } catch (error) {
      console.log(error);
      toast.error("Borrow request error");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle onClick={() => console.log(lenderBorrowerMapping)}>
          Borrow Tokens
        </CardTitle>
        <CardDescription>
          Borrow tokens from lenders with mininmal interest.
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
              <p className='text-muted-foreground'>Lender earnings (INTX): </p>

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
          <Button onClick={() => handleBorrow()}>Borrow</Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default BorrowTokens;
