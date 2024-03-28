import React, { useContext } from "react";
import Image from "next/image";
import { ConnectKitButton } from "connectkit";
import { useRouter } from "next/router";
import Link from "next/link";

import { CreditContext } from "@/context/CreditContext";
import { Button } from "@/components/ui/button";
import logo from "../assets/logo.svg";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const { queryParameter, setQueryParameter } = useContext(CreditContext);

  const router = useRouter();

  return (
    <div className=' text-white py-[20px] px-[20px] flex justify-between items-center'>
      <div className='flex items-center justify-center gap-[20px]'>
        <Image
          src={logo}
          width={60}
          onClick={() => {
            router.push("/");
          }}
          alt='logo'
          className='hover:cursor-pointer'
        />

        <div className='flex items-center justify-center gap-[10px]'>
          <Button
            variant='ghost'
            onClick={() => {
              router.push("/home");
            }}
            className={cn(
              "",
              router.pathname == "/home" && "bg-accent text-accent-foreground"
            )}
          >
            Lenders
          </Button>

          <Button
            variant='ghost'
            onClick={() => router.push("/pool")}
            className={cn(
              "",
              router.pathname == "/pool" && "bg-accent text-accent-foreground"
            )}
          >
            Pool
          </Button>

          <Link
            href={{
              pathname: "/account",
              query: { component: queryParameter },
            }}
            style={{
              color: "#fff",
            }}
          >
            <Button
              variant='ghost'
              className={cn(
                "",
                router.pathname == "/account" &&
                  "bg-accent text-accent-foreground"
              )}
            >
              Account
            </Button>
          </Link>
        </div>
      </div>

      <ConnectKitButton />
    </div>
  );
};

export default Navbar;
