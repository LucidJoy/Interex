import React, { createContext, useState } from "react";
import { useAccount } from "wagmi";

export const CreditContext = createContext({});

export const CreditProvider = ({ children }) => {
  const [first, setFirst] = useState(false);
  const [tokenA, setTokenA] = useState("");
  const [tokenB, setTokenB] = useState("");

  return (
    <CreditContext.Provider
      value={{ first, setFirst, tokenA, setTokenA, tokenB, setTokenB }}
    >
      {children}
    </CreditContext.Provider>
  );
};
