import React from "react";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import AddLiquidity from "@/components/AddLiquidity";
import BorrowTokens from "@/components/BorrowTokens";

const Pool = () => {
  return (
    <div className='flex items-center justify-center nav-h w-full'>
      <Tabs defaultValue='add' className='w-[500px]'>
        <TabsList className='grid w-full grid-cols-3'>
          <TabsTrigger value='add'>Add Liquidity</TabsTrigger>
          <TabsTrigger value='borrow'>Borrow Tokens</TabsTrigger>
          <TabsTrigger value='remove'>Remove Liquidity</TabsTrigger>
        </TabsList>

        <TabsContent value='add'>
          <AddLiquidity />
        </TabsContent>

        <TabsContent value='borrow'>
          <BorrowTokens />
        </TabsContent>

        <TabsContent value='remove'>
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Change your ok here. After saving, you'll be logged out.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-2'>
              <div className='space-y-1'>
                <Label htmlFor='current'>Current password</Label>
                <Input id='current' type='password' />
              </div>
              <div className='space-y-1'>
                <Label htmlFor='new'>New password</Label>
                <Input id='new' type='password' />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save password</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Pool;
