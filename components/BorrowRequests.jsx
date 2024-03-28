import React, { useContext, useEffect } from "react";
import Image from "next/image";
import { RotateCw } from "lucide-react";
import { toast } from "sonner";

import { CreditContext } from "@/context/CreditContext";
import Hint from "./Hint";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "./ui/button";
import tick from "../assets/tick.svg";
import cross from "../assets/cross.svg";
import { useAccount } from "wagmi";
import { shortenAddress } from "@/utils/shortenAddr";
import Loading from "./Loading";

const BorrowRequests = () => {
  const { lenderBorrowerMapping, borrowTokens, borrowTokensLoad } =
    useContext(CreditContext);
  const { address } = useAccount();

  const handleBorrow = (borrower, amount) => {
    borrowTokens(address, borrower, amount.toString());
  };

  const handleRefresh = async () => {
    try {
      //dummy
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
              Borrow Requests
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
              <TableHead className='text-center'>Requested</TableHead>
              <TableHead className='text-center'>Accept / Reject</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {lenderBorrowerMapping &&
              lenderBorrowerMapping.get(address) &&
              lenderBorrowerMapping.get(address).map((borrower, index) => (
                <TableRow key={index} className='text-center'>
                  <TableCell className='font-medium'>{index + 1}</TableCell>
                  <TableCell>{shortenAddress(borrower.borrower)}</TableCell>
                  <TableCell>{borrower.amount}</TableCell>
                  {borrowTokensLoad ? (
                    <TableCell className='flex items-center justify-center'>
                      <Loading />
                    </TableCell>
                  ) : (
                    <TableCell className='text-center flex flex-row gap-[10px] items-center justify-center'>
                      <Button
                        variant='green'
                        onClick={() =>
                          handleBorrow(borrower.borrower, borrower.amount)
                        }
                      >
                        <Image src={tick} />
                      </Button>
                      <Button variant='red'>
                        <Image src={cross} />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default BorrowRequests;
