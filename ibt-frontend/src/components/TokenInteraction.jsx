import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import abi from "../IBTToken.json";

const contractAddress = "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853";

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
      const newProvider = new ethers.BrowserProvider(window.ethereum); // Utilizare pentru ethers v6
      const newSigner = await newProvider.getSigner();
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
  
      setProvider(newProvider);
      setSigner(newSigner); // Stochează semnatarul
      setAccount(accounts[0]); // Stochează contul conectat
  
      alert("Wallet connected: " + accounts[0]);
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
      const balance = await contract.balanceOf(account);
  
      if (!balance) {
        console.error("Balance is undefined or null.");
        return;
      }
  
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
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          console.log("Account changed:", accounts[0]);
        } else {
          setAccount("");
          alert("Please connect to MetaMask.");
        }
      });

      window.ethereum.on("chainChanged", (chainId) => {
        console.log("Chain changed:", chainId);
        alert(`You have switched to network: ${parseInt(chainId, 16)}`);
      });

      return () => {
        window.ethereum.removeListener("accountsChanged", () => {});
        window.ethereum.removeListener("chainChanged", () => {});
      };
    }
    

  }, []);

  const testPress = async () => {
    console.log("Account:", account);

    const newProvider = new ethers.BrowserProvider(window.ethereum); // ethers v6
    const newSigner = await newProvider.getSigner();

    try {
        const gasEstimate = await contract.estimateGas.mint(account, ethers.parseUnits(amount, 18));
        console.log("Estimated gas:", gasEstimate.toString());
      } catch (error) {
        console.error("Gas estimation failed:", error);
      }
      
  }

  return (
    <div className="token-interaction">
      {!account ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <div>
          <p>Connected Account: {account}</p>
          <button onClick={getBalance}>Get Balance</button>
          <p>Balance: {balance} IBT</p>
          <input
            type="number"
            placeholder="Amount to Mint"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button onClick={mintTokens}>Mint Tokens</button>

          <button onClick={testPress}> APASA </button>
        </div>
      )}
    </div>
  );
}

export default TokenInteraction;
