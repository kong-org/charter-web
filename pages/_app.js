import "tailwindcss/tailwind.css";
import "./styles.css";
import { Provider, chain, defaultChains } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { WalletLinkConnector } from "wagmi/connectors/walletLink";
function MyApp({ Component, pageProps }) {
  // API key for Ethereum node
  // Two popular services are Infura (infura.io) and Alchemy (alchemy.com)
  const infuraId = process.env.NEXT_INFURA_ID;

  // Chains for connectors to support
  const chains = defaultChains;

  // Set up connectors
  const connectors = ({ chainId }) => {
    const rpcUrl =
      chains.find((x) => x.id === chainId)?.rpcUrls?.[0] ??
      chain.mainnet.rpcUrls[0];
    return [
      new InjectedConnector({
        chains,
        options: { shimDisconnect: true },
      }),
      new WalletConnectConnector({
        options: {
          infuraId,
          qrcode: true,
          clientMeta: { url: "https://charter.kong.land/" },
        },
      }),
    ];
  };

  return (
    <Provider connectors={connectors}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
