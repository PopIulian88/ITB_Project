import React, { useState } from "react";
import Header from "./components/Header";
import TokenInteraction from "./components/TokenInteraction";
import SuiInteraction from "./components/SuiInteraction";
import "./App.css";

function App() {
  const [selectedBlockchain, setSelectedBlockchain] = useState("ethereum"); // "ethereum" sau "sui"

  return (
    <div className="App">
      <Header
        selectedBlockchain={selectedBlockchain}
        onSelectBlockchain={setSelectedBlockchain}
      />
      {selectedBlockchain === "ethereum" ? (
        <TokenInteraction />
      ) : (
        <SuiInteraction />
      )}
    </div>
  );
}

export default App;
