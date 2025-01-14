import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import abi from "../IBTToken.json";
import "../styles/TokenInteraction.css";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function TokenInteraction() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");

  const connectWallet = async () => {
    console.log("Connecting wallet...");
  
    if (!window.ethereum) {
      console.error("MetaMask not found");
      alert("Please install MetaMask!");
      return;
    }
  
    console.log("MetaMask detected");
  
    try {
      const newProvider = new ethers.BrowserProvider(window.ethereum);
      const newSigner = await newProvider.getSigner();
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setProvider(newProvider);
      setSigner(newSigner);
      setAccount(accounts[0]);
      alert(`Wallet connected: ${accounts[0]}`);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      alert("Failed to connect wallet. Please try again.");
    }
  };
  
  
  
  
  const getBalance = async () => {
    if (!signer || !account) {
      console.error("Signer or account not defined.");
      return;
    }

    try {
      const contract = new ethers.Contract(contractAddress, abi, signer);
  
      console.log("Fetching balance for account:", account);
      console.log("Contract address:", contractAddress);
  
      const balance = await contract.balanceOf(account);
      console.log("Raw balance from contract:", balance);
  
      const formattedBalance = ethers.formatUnits(balance, 18);
      setBalance(formattedBalance);
  
      console.log("Formatted balance:", formattedBalance);
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };
  
  
  const mintTokens = async () => {
    if (!signer || !account || !amount) {
      alert("Please connect your wallet and enter a valid amount.");
      return;
    }
  
    try {
      const contract = new ethers.Contract(contractAddress, abi, signer);
      console.log("Contract created:", contract);
  
      // Verifică existența funcției mint
      if (!contract.mint) {
        console.error("Function mint does not exist in the contract.");
        alert("The mint function is not available in the contract.");
        return;
      }
  
      const tx = await contract.mint(account, ethers.parseUnits(amount, 18));
      console.log("Transaction sent:", tx.hash);
  
      await tx.wait();
      console.log("Transaction confirmed:", tx.hash);
  
      alert(`Successfully minted ${amount} IBT tokens to ${account}.`);
      getBalance();
    } catch (error) {
      console.error("Error minting tokens:", error);
      alert("Failed to mint tokens. Please try again.");
    }
  };
  
  
  
  
  // Pasul 5: Gestionarea evenimentelor MetaMask
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        setAccount(accounts.length > 0 ? accounts[0] : "");
      });

      window.ethereum.on("chainChanged", (chainId) => {
        alert(`You have switched to network: ${parseInt(chainId, 16)}`);
      });

      return () => {
        window.ethereum.removeListener("accountsChanged", () => {});
        window.ethereum.removeListener("chainChanged", () => {});
      };
    }
    

  }, []);

  return (
    <div className="token-interaction">
      {!account ? (
        <button className="btn connect-wallet" onClick={connectWallet}>
          Connect Wallet
        </button>
      ) : (
        <div className="card">
          <p><strong>Connected Account:</strong> {account}</p>
          <p><strong>Balance:</strong> {balance} IBT</p>
          <div className="input-group">
            <input
              type="number"
              placeholder="Amount to Mint"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <button className="btn mint" onClick={mintTokens}>
              Mint Tokens
            </button>
          </div>
          <button className="btn get-balance" onClick={getBalance}>
            Get Balance
          </button>
        </div>
      )}
    </div>
  );
}

export default TokenInteraction;
