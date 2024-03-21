import React, { createContext, useState, useEffect } from "react";

import InterexPoolABI from "./InterexPool.json";
import { ethers } from "ethers";

export const CreditContext = createContext({});

// mumbai testnet
// Interex20: 0xc34e3F6558A5b7Ae66932a0ADf5A402A157BeE81
// InterexPool: 0x8355c5730d1F6AF0d46DCF618044F6877296c4C2

export const CreditProvider = ({ children }) => {
  const [first, setFirst] = useState(false);
  const [tokenA, setTokenA] = useState("");
  const [tokenB, setTokenB] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [poolBalance, setPoolBalance] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const interexPoolAddress = "0xf44f15a55693043454714Af56Bd5e32c193E3529";

  const addLiquidity = async (amount) => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();

        const contract = new ethers.Contract(
          interexPoolAddress,
          InterexPoolABI,
          signer
        );

        const amountAsString = ethers.utils.parseEther(amount).toString();

        await contract.addLiquidity(amountAsString, {
          gasLimit: 500000,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const liquidityProvidersArr = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();

        const contract = new ethers.Contract(
          interexPoolAddress,
          InterexPoolABI,
          signer
        );

        const txRes = await contract.lenderArrLength({
          gasLimit: 500000,
        });

        console.log(txRes);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const borrowTokens = async (lender, amount) => {
    try {
      if (window.ethereum) {
        setIsLoading(true);

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();

        const contract = new ethers.Contract(
          interexPoolAddress,
          InterexPoolABI,
          signer
        );

        const txRes = await contract.borrowTokens(lender, amount, {
          gasLimit: 500000,
        });

        setIsLoading(false);
        console.log(txRes);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <CreditContext.Provider
      value={{
        first,
        setFirst,
        tokenA,
        setTokenA,
        tokenB,
        setTokenB,
        currentUser,
        setCurrentUser,
        interexPoolAddress,
        addLiquidity,
        liquidityProvidersArr,
        poolBalance,
        setPoolBalance,
        borrowTokens,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </CreditContext.Provider>
  );
};
