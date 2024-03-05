import { WagmiConfig, createConfig } from "wagmi";
import {
  ConnectKitProvider,
  ConnectKitButton,
  getDefaultConfig,
} from "connectkit";
import dynamic from "next/dynamic";

import { CreditProvider } from "@/context/CreditContext";
import { Separator } from "@/components/ui/separator";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";
import "@/styles/globals.css";

// TODO: Launch app button

const AnimatedCursor = dynamic(() => import("react-animated-cursor"), {
  ssr: false,
});

const config = createConfig(
  getDefaultConfig({
    // Required API Keys
    alchemyId: "0YB05pw82Hcy9XURB229iSxTdo4CdN23", // or infuraId
    walletConnectProjectId: "03f7a34eb9ec74413407ed6f27d138fe",

    // Required
    appName: "lfgho",

    // Optional
    appDescription: "Your App Description",
    appUrl: "https://family.co", // your app's url
    appIcon: "https://family.co/logo.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
  }),
);

export default function App({ Component, pageProps }) {
  return (
    <CreditProvider>
      <WagmiConfig config={config}>
        <ConnectKitProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            storageKey="theme"
          >
            {/* <AnimatedCursor
              innerSize={8}
              outerSize={35}
              // color='193, 11, 111'
              outerAlpha={0.2}
              innerScale={0.7}
              outerScale={2}
              outerStyle={{
                border: "3px solid #999999",
                backgroundColor: "transparent",
              }}
              innerStyle={{
                backgroundColor: "#999999",
              }}
            /> */}
            <Toaster />
            <div>
              <Navbar />
              <Separator />
              <Component {...pageProps} />
            </div>
          </ThemeProvider>
        </ConnectKitProvider>
      </WagmiConfig>
    </CreditProvider>
  );
}
