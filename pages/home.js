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

const Home = () => {
  return (
    <div className='flex items-center justify-center flex-col mt-[50px]'>
      <div className='text-white w-[1000px]'>
        <div className='flex flex-row justify-between items-center mb-[20px]'>
          <h3 className='scroll-m-20 text-2xl font-semibold tracking-normal'>
            Active Borrowings
          </h3>
          <Button>Borrow</Button>
        </div>

        <Table>
          <TableCaption>A list of your recent borrowings.</TableCaption>
          <TableHeader>
            <TableRow className='hover:bg-transparent'>
              <TableHead className='w-[100px]'>Sl.</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Tenure</TableHead>
              <TableHead className='text-center'>Pay</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <TableRow>
              <TableCell className='font-medium'>1</TableCell>
              <TableCell>0xabc...def</TableCell>
              <TableCell>$1000</TableCell>
              <TableCell>357</TableCell>
              <TableCell>7 days</TableCell>
              <TableCell className='text-center'>
                <Button variant='green'>Send</Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className='font-medium'>2</TableCell>
              <TableCell>0xabc...def</TableCell>
              <TableCell>$2000</TableCell>
              <TableCell>400</TableCell>
              <TableCell>7 days</TableCell>
              <TableCell className='text-center'>
                <Button variant='green'>Send</Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className='font-medium'>3</TableCell>
              <TableCell>0xabc...def</TableCell>
              <TableCell>$3000</TableCell>
              <TableCell>645</TableCell>
              <TableCell>7 days</TableCell>
              <TableCell className='text-center'>
                <Button variant='green'>Send</Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Home;
