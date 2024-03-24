import React from "react";
import Image from "next/image";
import { ConnectKitButton } from "connectkit";
import { useRouter } from "next/router";

import { Button } from "@/components/ui/button";
import logo from "../assets/logo.svg";
import { cn } from "@/lib/utils";

const Navbar = () => {
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
            onClick={() => router.push("/credit")}
            className={cn(
              "",
              router.pathname == "/credit" && "bg-accent text-accent-foreground"
            )}
          >
            Credit
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

          <Button
            variant='ghost'
            onClick={() => router.push("/account")}
            className={cn(
              "",
              router.pathname == "/account" &&
                "bg-accent text-accent-foreground"
            )}
          >
            Account
          </Button>
        </div>
      </div>

      <ConnectKitButton />
    </div>
  );
};

export default Navbar;
