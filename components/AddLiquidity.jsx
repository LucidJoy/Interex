import React, { useContext } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreditContext } from "@/context/CreditContext";
import { toast } from "sonner";

const AddLiquidity = () => {
  const { tokenA, setTokenA, tokenB, setTokenB } = useContext(CreditContext);

  const handleLiquidity = () => {
    if (tokenA === tokenB) {
      return toast.error("Please select different tokens");
    } else {
      // TODO: run func liquidity
      console.log("func run liquidity");
    }
    // console.log(tokenA, tokenB);
  };

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle className=''>Add Liquidity</CardTitle>
          {/* <CardDescription></CardDescription> */}
        </div>
      </CardHeader>

      <CardContent className='space-y-2'>
        <div className='space-y-1'>
          <Label htmlFor='name'>First Token</Label>
          <div className='flex gap-[20px]'>
            <Input
              type='number'
              id='name'
              defaultValue='0.001'
              min={0.001}
              step={0.001}
            />

            <Select onValueChange={(val) => setTokenA(val)}>
              <SelectTrigger className=''>
                <SelectValue placeholder='Select a token' />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Token Pairs</SelectLabel>
                  <SelectItem value='eth'>ETH</SelectItem>
                  <SelectItem value='btc'>BTC</SelectItem>
                  <SelectItem value='matic'>MATIC</SelectItem>
                  <SelectItem value='link'>LINK</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className='space-y-1'>
          <Label htmlFor='name'>Second Token</Label>
          <div className='flex gap-[20px]'>
            <Input
              type='number'
              id='name'
              defaultValue='0.001'
              min={0.001}
              step={0.001}
            />

            {/* TODO: Can't select submit with different tokens
             */}

            <Select onValueChange={(val) => setTokenB(val)}>
              <SelectTrigger>
                <SelectValue placeholder='Select a token' />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Token Pairs</SelectLabel>
                  <SelectItem value='eth'>ETH</SelectItem>
                  <SelectItem value='btc'>BTC</SelectItem>
                  <SelectItem value='matic'>MATIC</SelectItem>
                  <SelectItem value='link'>LINK</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <p className='font-bold text-[16px] pt-[15px]'>Summary</p>

        <div className='flex items-center flex-row justify-between text-[14px]'>
          <p className='text-muted-foreground'>Rate: </p>
          <p className='font-semibold'>2.55%</p>
        </div>
      </CardContent>

      <CardFooter>
        <Button onClick={handleLiquidity}>Add Liquidity</Button>
      </CardFooter>
    </Card>
  );
};

export default AddLiquidity;
