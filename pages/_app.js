import React, { useEffect } from "react";
import { WagmiConfig, createConfig } from "wagmi";
import { polygonMumbai, kromaSepolia } from "wagmi/chains";
import {
  ConnectKitProvider,
  ConnectKitButton,
  getDefaultConfig,
} from "connectkit";
import { watchAccount } from "@wagmi/core";

import { CreditProvider } from "@/context/CreditContext";
import { Separator } from "@/components/ui/separator";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";
import "@/styles/globals.css";

const config = createConfig(
  getDefaultConfig({
    chains: [polygonMumbai, kromaSepolia],

    // Required API Keys
    alchemyId: "0YB05pw82Hcy9XURB229iSxTdo4CdN23", // or infuraId
    walletConnectProjectId: "03f7a34eb9ec74413407ed6f27d138fe",

    // Required
    appName: "interex",

    // Optional
    appDescription: "Your App Description",
    appUrl: "https://family.co", // your app's url
    appIcon: "https://family.co/logo.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
  })
);

export default function App({ Component, pageProps }) {
  return (
    <WagmiConfig config={config}>
      <CreditProvider>
        <ConnectKitProvider>
          <ThemeProvider
            attribute='class'
            defaultTheme='dark'
            enableSystem={false}
            storageKey='theme'
          >
            <Toaster />
            <div>
              <Navbar />
              <Separator />
              <Component {...pageProps} />
            </div>
          </ThemeProvider>
        </ConnectKitProvider>
      </CreditProvider>
    </WagmiConfig>
  );
}
