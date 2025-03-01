import { ReactNode } from "react";
import { WagmiProvider, http } from "wagmi";
import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { sepolia } from "wagmi/chains";
import "@rainbow-me/rainbowkit/styles.css";

const queryClient = new QueryClient();
const WALLET_CONNECT_PROJECT_ID = "f343252c948d4e6e7d47203b70f626c2";

const config = getDefaultConfig({
  appName: "Decentra Vote App",
  projectId: WALLET_CONNECT_PROJECT_ID,
  chains: [sepolia],
  transports: {
    [sepolia.id]: http("https://eth-sepolia.g.alchemy.com/v2/qpUwEqZco5CjKPiDYYaaOCamsyd45fxA"),
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
