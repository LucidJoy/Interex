import React, { useContext, useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { ethers } from "ethers";

import Hint from "@/components/Hint";
import AvatarDemo from "./AvatarDemo";
import { CreditContext } from "@/context/CreditContext";
import { copyToClipboard } from "@/utils/copyToClipboard";

const Profile = () => {
  const { address } = useAccount();
  const { getTokenBalance } = useContext(CreditContext);

  const [currentBalance, setCurrentBalance] = useState(null);

  useEffect(() => {
    const func = async () => {
      const balance = await getTokenBalance(address);
      balance && setCurrentBalance(ethers.utils.formatEther(balance));
    };
    func();
  }, [address]);

  return (
    <div className='flex items-center justify-center flex-col mt-[50px] w-[calc(100vw-250px)] ml-[250px]'>
      <div className='text-white w-[1000px]'>
        <div className='flex flex-row justify-between items-center mb-[20px]'>
          <h3 className='scroll-m-20 text-2xl font-semibold tracking-normal'>
            Profile
          </h3>
        </div>

        <div className='flex flex-row mt-[30px] items-center gap-[20px] mb-[30px]'>
          <AvatarDemo />

          <div className='flex flex-col gap-[5px]'>
            <Hint
              label='Click to copy'
              side='top'
              align='center'
              sideOffset={5}
            >
              <div
                className='text-[18px] font-medium cursor-pointer'
                onClick={() => copyToClipboard(address)}
              >
                {address && address}
              </div>
            </Hint>

            <div className='text-muted-foreground text-[14px]'>
              Total balance:{" "}
              <span className='font-semibold text-white/80'>
                {currentBalance} INTX
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
