'use client'

import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,lightTheme
} from '@rainbow-me/rainbowkit';
import { WagmiProvider ,http} from 'wagmi';
import {
 sepolia
} from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import * as React from 'react';

const config = getDefaultConfig({
  appName: "My RainbowKit App",
  projectId: "7387b029f625e74306fdf2cf7e53df8e",
  chains: [sepolia],
  transports: {
    [sepolia.id]: http('https://eth-sepolia.g.alchemy.com/v2/gvwnMmbaVIiDGkBZitp0DQ9rs8Z2Uz5m')
  }
});

const queryClient = new QueryClient();

const Providers = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
      <RainbowKitProvider
        theme={lightTheme({
          accentColor: "#16a34a",
          accentColorForeground: "white",
          borderRadius: "small",
          fontStack: "system",
          overlayBlur: "none",
        })}
      >
        {children}
      </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default Providers;
