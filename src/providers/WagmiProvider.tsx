import { ReactNode } from "react";
import { WagmiProvider, http } from "wagmi";
import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { sepolia } from "wagmi/chains";

import "@rainbow-me/rainbowkit/styles.css";

const queryClient = new QueryClient();

const config = getDefaultConfig({
  appName: "Decentra Vote App",
  projectId: "decentra-vote-app",
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(import.meta.env.SEPOLIA_RPC_URL),
  },
});

interface WagmiProviderProps {
  children: ReactNode;
}

const WagmiProviderWrapper = ({ children }: WagmiProviderProps) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default WagmiProviderWrapper;
