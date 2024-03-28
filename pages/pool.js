import React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AddLiquidity from "@/components/AddLiquidity";
import BorrowTokens from "@/components/BorrowTokens";

const Pool = () => {
  return (
    <div className='flex items-center justify-center nav-h w-full'>
      <Tabs defaultValue='add' className='w-[500px]'>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='add'>Add Liquidity</TabsTrigger>
          <TabsTrigger value='borrow'>Borrow Tokens</TabsTrigger>
        </TabsList>

        <TabsContent value='add'>
          <AddLiquidity />
        </TabsContent>

        <TabsContent value='borrow'>
          <BorrowTokens />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Pool;
