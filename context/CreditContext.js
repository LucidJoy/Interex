import React, { createContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import { getParsedEthersError } from "@enzoferey/ethers-error-parser";
import { useAccount } from "wagmi";
import { toast } from "sonner";

import InterexPoolABI from "./InterexPool.json";
import Interex20ABI from "./Interex20.json";
import { formatLiquidityProviders } from "@/utils/formatLiquidityProviders";

export const CreditContext = createContext({});

// mumbai testnet
// const interexPoolAddress = "0xd578Eb5FAC047b980Bae61cBf709bEF50C7c47d8";
// const interex20Address = "0x43dCe167b5469229E3B5D2C883a99aBbF7e9cF5A";

export const CreditProvider = ({ children }) => {
  const [poolBalance, setPoolBalance] = useState(null);
  const [allPoolLenders, setAllPoolLenders] = useState([]);

  // loading states
  const [addLiquidityLoad, setAddLiquidityLoad] = useState(false);
  const [borrowTokensLoad, setBorrowTokensLoad] = useState(false);

  const interexPoolAddress = "0xd578Eb5FAC047b980Bae61cBf709bEF50C7c47d8";
  const interex20Address = "0x43dCe167b5469229E3B5D2C883a99aBbF7e9cF5A";

  // use effects
  useEffect(() => {
    liquidityProvidersArr();
  }, [allPoolLenders]);

  const addLiquidity = async (amount) => {
    try {
      if (window.ethereum) {
        setAddLiquidityLoad(true);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();

        const tokenContract = new ethers.Contract(
          interex20Address,
          Interex20ABI,
          signer
        );

        const amountToApprove = ethers.utils.parseEther(amount);
        const approvalTx = await tokenContract.approve(
          interexPoolAddress,
          amountToApprove,
          { gasLimit: 500000 }
        );
        await approvalTx.wait(1);

        const poolContract = new ethers.Contract(
          interexPoolAddress,
          InterexPoolABI,
          signer
        );

        const amountAsString = ethers.utils.parseEther(amount).toString();

        const txRes = await poolContract.addLiquidity(amountAsString, {
          gasLimit: 500000,
        });

        await txRes.wait(1);
        setAddLiquidityLoad(false);
        toast.success("Transaction successful");
      }
    } catch (error) {
      const parsedEthersError = getParsedEthersError(error);
      toast.error(
        `${parsedEthersError.errorCode} -> ${parsedEthersError.context}`
      );
      setAddLiquidityLoad(false);
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

        const txRes = await contract.callStatic.poolLendersArr();

        const data = formatLiquidityProviders(txRes);
        setAllPoolLenders(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getTokenBalance = async (address) => {
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

        const balance = await contract.callStatic.getTokenBalance(address);
        // console.log("Token balance:", ethers.utils.formatEther(balance));
        return balance;
      }
    } catch (error) {
      const parsedEthersError = getParsedEthersError(error);
      toast.error(
        `${parsedEthersError.errorCode} -> ${parsedEthersError.context}`
      );
    }
  };

  const borrowTokens = async (lender, amount) => {
    try {
      if (window.ethereum) {
        setBorrowTokensLoad(true);

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
        console.log(txRes);

        await txRes.wait(1);
        setBorrowTokensLoad(false);
      }
    } catch (error) {
      const parsedEthersError = getParsedEthersError(error);
      toast.error(
        `${parsedEthersError.errorCode} -> ${parsedEthersError.context}`
      );
      setBorrowTokensLoad(false);
    }
  };

  const getPoolEarnings = async (address) => {
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

        const balance = await contract.callStatic.getPoolEarnings(address);
        // console.log("Token balance:", ethers.utils.formatEther(balance));
        return balance;
      }
    } catch (error) {
      const parsedEthersError = getParsedEthersError(error);
      toast.error(
        `${parsedEthersError.errorCode} -> ${parsedEthersError.context}`
      );
    }
  };

  return (
    <CreditContext.Provider
      value={{
        interexPoolAddress,
        addLiquidity,
        liquidityProvidersArr,
        poolBalance,
        setPoolBalance,
        borrowTokens,
        addLiquidityLoad,
        setAddLiquidityLoad,
        borrowTokensLoad,
        setBorrowTokensLoad,
        getTokenBalance,
        allPoolLenders,
        getPoolEarnings,
      }}
    >
      {children}
    </CreditContext.Provider>
  );
};
