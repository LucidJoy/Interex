import { ethers } from "ethers";

export function formatLiquidityProviders(rawData) {
  const formattedProviders = [];

  for (let i = 0; i < rawData.length; i++) {
    const [lender, amountLended, poolEarnings, borrowerEarnings, depositTime] =
      rawData[i];

    const formattedProvider = {
      lender: lender,
      amountLended: ethers.utils.formatEther(amountLended),
      poolEarnings: ethers.utils.formatEther(poolEarnings),
      borrowerEarnings: ethers.utils.formatEther(borrowerEarnings),
      depositTime: new Date(depositTime * 1000).toLocaleString(),
    };

    formattedProviders.push(formattedProvider);
  }

  return formattedProviders;
}
