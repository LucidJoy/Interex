import React, { useContext, useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { toast } from "sonner";
import { useRouter } from "next/router";

import Hint from "@/components/Hint";
import { Separator } from "@/components/ui/separator";
import { CreditContext } from "@/context/CreditContext";

const Profile = () => {
  const { address } = useAccount();
  const { queryParameter, setQueryParameter } = useContext(CreditContext);

  const [currentUser, setCurrentUser] = useState("");

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard
        .writeText(address)
        .then(() => toast.success("Copied to clipboard."));
    } catch (err) {
      toast.error("Failed to copy.");
    }
  };

  // useEffect(() => setCurrentUser(address), [address]);

  return (
    <div className='flex items-center justify-center flex-col mt-[50px] w-[calc(100vw-250px)] ml-[250px]'>
      <div className='text-white w-[1000px]'>
        <div className='flex flex-row justify-between items-center mb-[20px]'>
          <h3 className='scroll-m-20 text-2xl font-semibold tracking-normal'>
            Profile
          </h3>
        </div>

        <div className='flex flex-row mt-[30px] items-center gap-[20px] mb-[30px]'>
          <div className='rounded-full bg-blue-700 h-[100px] w-[100px]'></div>

          <div className='flex flex-col gap-[5px]'>
            <Hint
              label='Click to copy'
              side='top'
              align='center'
              sideOffset={5}
            >
              <div
                className='text-[18px] font-medium cursor-pointer'
                onClick={copyToClipboard}
              >
                {address && address}
              </div>
            </Hint>

            <div className='text-muted-foreground text-[14px]'>
              MATIC Testnet
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
