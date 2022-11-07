import "./App.css";

import { useEffect, useState } from "react";

import Web3 from "web3";
import { InjectedConnector } from "@web3-react/injected-connector";
import { Web3ReactProvider, useWeb3React } from "@web3-react/core";

const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42],
});

const chainsApiUrl = "https://chainid.network/chains.json"

function Wallet() {
  const { active, account, activate, deactivate, chainId, error } =
    useWeb3React();

  const [chains, setChains] = useState<GeneralObject>({});

  useEffect(() => {
    fetch(chainsApiUrl).then((response) => {
      response.json().then((data: ChainsResult) => {
        const chainIds: GeneralObject = {};

        data.forEach((item) => {
          const key = item.chainId;
          chainIds[key] = item.name;
        });

        setChains(chainIds);
      });
    });
  }, []);

  async function getConnect() {
    try {
      await activate(injected);
    } catch (ex) {
      console.log(ex);
    }
  }

  async function disconnect() {
    try {
      deactivate();
    } catch (ex) {
      console.log(ex);
    }
  }
  console.log(error?.name)

  return (
    <div className="container">
      {error ? (
        <div className="error">
        <p>
          {error.message}
          </p>
          <p>
          {error.name === "UnsupportedChainIdError" && "Please select other wallet"}
          {error.name === "NoEthereumProviderError" && <>Please download the <a href='https://metamask.io/download/' target={"_blank"} rel="noreferrer">extension</a></>}
        </p>
        </div>
      ) : active && chainId ? (
        <div className="content">
          <p>
            Account:
            <b>{account}</b>
            <br />
            Network: <b>{chains[chainId.toString()] || chainId}</b>
          </p>
          <button onClick={disconnect}>Disconnect</button>
        </div>
      ) : (
        <button onClick={getConnect} className="connect-btn">Connect to MetaMask</button>
      )}
    </div>
  );
}

function getLibrary(provider: any) {
  return new Web3(provider);
}

function App() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Wallet />
    </Web3ReactProvider>
  );
};

export default App;
