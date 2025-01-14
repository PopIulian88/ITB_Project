import React, { useState } from "react";
import { getOwnedObjects, getObjectDetails, mintTokens } from "../utils/suiUtils";

function SuiInteraction() {
  const [address, setAddress] = useState("0xeac91434bac61b6819323d1cd84892497e85ab5b953791a105bed4acbb5b1782");
  const [balance, setBalance] = useState(null);
  const [mintAmount, setMintAmount] = useState("");
  const [gasObject, setGasObject] = useState("");
  const [status, setStatus] = useState("");

  // Funcție pentru a obține balanța
  const handleGetBalance = async () => {
    if (!address) {
      alert("Please provide a valid address.");
      return;
    }

    try {
      setStatus("Fetching balance...");
      const objects = await getOwnedObjects(address);

      if (!objects || objects.length === 0) {
        alert("This address owns no objects.");
        setStatus("");
        return;
      }

      // Obține detaliile pentru primul obiect
      const firstObject = objects[0].data.objectId;
      const objectDetails = await getObjectDetails(firstObject);

      // Extrage balanța (ajustează structura în funcție de contractul tău)
      const balanceField = objectDetails.data?.fields?.balance || "0";
      setBalance(balanceField);
      setStatus("Balance fetched successfully!");
    } catch (error) {
      console.error("Error in handleGetBalance:", error.message);
      setStatus("Failed to fetch balance.");
    }
  };

  // Funcție pentru a mintui tokenuri
  const handleMintTokens = async () => {
    if (!mintAmount || !gasObject) {
      alert("Please provide mint amount and gas object.");
      return;
    }

    try {
      setStatus("Minting tokens...");
      await mintTokens(
        "0xea7832700dbde4a35d0cf202b7bfcf08f9e1e4768559827128e52a8c365bafd8", // Înlocuiește cu ID-ul Package al contractului tău
        "TokenModule",
        "mint",
        ["IBT Token", mintAmount],
        gasObject,
        5000000
      );
      setStatus(`Minted ${mintAmount} tokens successfully!`);
    } catch (error) {
      console.error("Error in handleMintTokens:", error.message);
      setStatus("Failed to mint tokens.");
    }
  };

  return (
    <div>
      <h2>Sui Interaction</h2>

      {/* Secțiunea pentru vizualizarea balanței */}
      <div>
        <input
          type="text"
          placeholder="Your Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <button onClick={handleGetBalance}>Get Balance</button>
        <p>Balance: {balance !== null ? balance : "N/A"}</p>
      </div>

      {/* Secțiunea pentru minting */}
      <div>
        <input
          type="text"
          placeholder="Gas Object"
          value={gasObject}
          onChange={(e) => setGasObject(e.target.value)}
        />
        <input
          type="number"
          placeholder="Mint Amount"
          value={mintAmount}
          onChange={(e) => setMintAmount(e.target.value)}
        />
        <button onClick={handleMintTokens}>Mint Tokens</button>
      </div>

      {/* Mesaj de status */}
      <p>{status}</p>
    </div>
  );
}

export default SuiInteraction;
