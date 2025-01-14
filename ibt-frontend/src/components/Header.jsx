import React from "react";
import "../styles/Header.css";

function Header({ selectedBlockchain, onSelectBlockchain }) {
  return (
    <header className="header">
      <h1>IBT Token DApp</h1>
      <div className="blockchain-switch">
        <button
          className={selectedBlockchain === "ethereum" ? "active" : ""}
          onClick={() => onSelectBlockchain("ethereum")}
        >
          Ethereum
        </button>
        <button
          className={selectedBlockchain === "sui" ? "active" : ""}
          onClick={() => onSelectBlockchain("sui")}
        >
          Sui
        </button>
      </div>
    </header>
  );
}

export default Header;
