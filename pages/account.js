import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { useAccount } from "wagmi";
import { toast } from "sonner";
import { useRouter } from "next/router";

import { cn } from "@/utils/cn";
import profileIcon from "../assets/profile.svg";
import borrowIcon from "../assets/handshake.svg";
import borrowers from "../assets/borrowers.svg";
import borrowings from "../assets/borrowings.svg";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { CreditContext } from "@/context/CreditContext";
import Profile from "@/components/Profile";
import BorrowRequests from "@/components/BorrowRequests";
import Borrowers from "@/components/Borrowers";
import Borrowings from "@/components/Borrowings";

const Account = () => {
  const { address } = useAccount();
  const { queryParameter, setQueryParameter } = useContext(CreditContext);

  const router = useRouter();

  return (
    <>
      <div className='hidden md:flex h-full mt-[80px] w-[250px] z-30 flex-col fixed inset-y-0 border-r border-r-[#27272A] px-[10px]'>
        <div className='space-y-4 flex flex-col items-center h-full text-primary w-full py-3'>
          <Button
            variant='sidebar'
            className={cn(
              "w-full flex flex-row gap-[10px] items-center justify-start",
              router.query.component === "profile" && "bg-[#383838]/80"
            )}
            onClick={() => router.push({ query: { component: "profile" } })}
          >
            <Image src={profileIcon} className='w-[20px] h-[20px]' />
            <p>Profile</p>
          </Button>

          <Button
            variant='sidebar'
            className={cn(
              "w-full flex flex-row gap-[10px] items-center justify-start",
              router.query.component === "requests" && "bg-[#383838]/80"
            )}
            onClick={() => router.push({ query: { component: "requests" } })}
          >
            <Image src={borrowIcon} className='w-[20px] h-[20px]' />
            <p>Borrow Requests</p>
          </Button>

          <Button
            variant='sidebar'
            className={cn(
              "w-full flex flex-row gap-[10px] items-center justify-start",
              router.query.component === "borrowers" && "bg-[#383838]/80"
            )}
            onClick={() => router.push({ query: { component: "borrowers" } })}
          >
            <Image src={borrowers} className='w-[20px] h-[20px]' />
            <p>Borrowers</p>
          </Button>

          <Button
            variant='sidebar'
            className={cn(
              "w-full flex flex-row gap-[10px] items-center justify-start",
              router.query.component === "borrowings" && "bg-[#383838]/80"
            )}
            onClick={() => router.push({ query: { component: "borrowings" } })}
          >
            <Image src={borrowings} className='w-[20px] h-[20px]' />
            <p>Borrowings</p>
          </Button>
        </div>
      </div>

      {router.query.component === "profile" && <Profile />}
      {router.query.component === "requests" && <BorrowRequests />}
      {router.query.component === "borrowers" && <Borrowers />}
      {router.query.component === "borrowings" && <Borrowings />}
    </>
  );
};

export default Account;
