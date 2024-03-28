import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { RotateCw } from "lucide-react";
import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Hint from "@/components/Hint";
import { Button } from "@/components/ui/button";
import { CreditContext } from "@/context/CreditContext";
import { shortenAddress } from "@/utils/shortenAddr";
import Loading from "@/components/Loading";

const Home = () => {
  const {
    allPoolLenders,
    removeLiquidity,
    removeLiquidityLoad,
    liquidityProvidersArr,
  } = useContext(CreditContext);

  const router = useRouter();

  const handleRemoveLiquidity = async (lender, amount) => {
    await removeLiquidity(lender);
  };

  const handleRefresh = async () => {
    try {
      await liquidityProvidersArr();
      toast.success("Refreshed");
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className='flex items-center justify-center flex-col mt-[50px]'>
      <div className='text-white w-[1000px]'>
        <div className='flex flex-row justify-between items-center mb-[20px]'>
          <div className='flex flex-row gap-[15px] items-center justify-center'>
            <h3 className='scroll-m-20 text-2xl font-semibold tracking-normal'>
              Liquidity Providers
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
            {allPoolLenders &&
              allPoolLenders
                .filter((lender) => lender.amountLended > 0)
                .map((lender, idx) => (
                  <TableRow className='text-center'>
                    <TableCell className='font-medium'>{idx + 1}</TableCell>
                    <TableCell>{shortenAddress(lender.lender)}</TableCell>
                    <TableCell>{lender.amountLended}</TableCell>
                    <TableCell>{lender.poolEarnings}</TableCell>
                    <TableCell>0 (HC)</TableCell>
                    <TableCell className='text-center'>
                      {removeLiquidityLoad ? (
                        <div className='flex items-center justify-center'>
                          <Loading />
                        </div>
                      ) : (
                        <Button
                          variant='red'
                          onClick={() =>
                            handleRemoveLiquidity(
                              lender.lender,
                              lender.amountLended
                            )
                          }
                        >
                          Remove
                        </Button>
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

export default Home;
