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

export const CreditProvider = ({ children }) => {
  const [poolBalance, setPoolBalance] = useState(null);
  const [allPoolLenders, setAllPoolLenders] = useState([]);
  const [queryParameter, setQueryParameter] = useState("profile");
  const [lenderBorrowerMapping, setLenderBorrowerMapping] = useState(new Map());
  const [borrowingsData, setBorrowingsData] = useState([]);

  // loading states
  const [addLiquidityLoad, setAddLiquidityLoad] = useState(false);
  const [borrowTokensLoad, setBorrowTokensLoad] = useState(false);

  const interex20Address = "0xa6366591489011D61b5b99d2649a5DdE0e330D86";
  const interexPoolAddress = "0xBF616602715dC6434498787b2a3dA8C7a4BF1fA5";

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
        toast.success("Add liquidity success.");
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

  const borrowTokens = async (lender, borrower, amount) => {
    try {
      if (window.ethereum) {
        setBorrowTokensLoad(true);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();

        const tokenContract = new ethers.Contract(
          interex20Address,
          Interex20ABI,
          signer
        );

        const amountToApprove = ethers.utils.parseEther(amount).toString();
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
        const txRes = await poolContract.borrowTokens(
          lender,
          borrower,
          amountAsString,
          {
            gasLimit: 500000,
          }
        );

        await txRes.wait(1);
        setBorrowTokensLoad(false);
        toast.success("Borrow tokens success.");
      }
    } catch (error) {
      console.log(error);
      setBorrowTokensLoad(false);
      toast.error("Failed to borrow tokens.");
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

  const getYourBorrowers = async (lender) => {
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

        const borrowers = await contract.callStatic.getYourBorrowers(lender);
        return borrowers;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAccruedInterest = async (lender, borrower) => {
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

        const aci = await contract.callStatic.getAccruedInterest(
          lender,
          borrower
        );
        return aci;
      }
    } catch (error) {
      console.log(error);
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
        queryParameter,
        setQueryParameter,
        lenderBorrowerMapping,
        setLenderBorrowerMapping,
        getYourBorrowers,
        getAccruedInterest,
      }}
    >
      {children}
    </CreditContext.Provider>
  );
};
