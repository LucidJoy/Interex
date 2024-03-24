import React from "react";
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
import { PlusIcon } from "@radix-ui/react-icons";

const Credit = () => {
  return (
    <div className='flex items-center justify-center flex-col mt-[50px]'>
      <div className='text-white w-[1000px]'>
        <div className='flex flex-row justify-between items-center mb-[20px]'>
          <h3 className='scroll-m-20 text-2xl font-semibold tracking-normal'>
            Credit Leaderboard
          </h3>
        </div>

        <Table>
          <TableCaption>A list of all credits.</TableCaption>
          <TableHeader>
            <TableRow className='hover:bg-transparent'>
              <TableHead className='w-[100px]'>Sl.</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Ask</TableHead>
              <TableHead className='text-center'>Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <TableRow>
              <TableCell className='font-medium'>1</TableCell>
              <TableCell>0xabc...def</TableCell>
              <TableCell>357</TableCell>
              <TableCell>1%</TableCell>
              <TableCell className='text-center'>
                <Button variant='green'>Repay</Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className='font-medium'>2</TableCell>
              <TableCell>0xabc...def</TableCell>
              <TableCell>456</TableCell>
              <TableCell>3%</TableCell>
              <TableCell className='text-center'>
                <Button variant='green'>Repay</Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className='font-medium'>3</TableCell>
              <TableCell>0xabc...def</TableCell>
              <TableCell>553</TableCell>
              <TableCell>2%</TableCell>
              <TableCell className='text-center'>
                <Button variant='green'>Repay</Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Credit;
