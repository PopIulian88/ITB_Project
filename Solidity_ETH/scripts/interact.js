const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  const contractAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"; // Adresa contractului

  // Conectează-te la contract
  const IBTToken = await ethers.getContractAt("IBTToken", contractAddress);

  console.log("Interacting with contract at:", contractAddress);

  // Exemplu: Mint tokens
  const mintTx = await IBTToken.mint(deployer.address, 1000);
  await mintTx.wait();
  console.log("Minted 1000 tokens to:", deployer.address);

  // Verifică balanța
  const balance = await IBTToken.balanceOf(deployer.address);
  console.log("Balance of deployer:", balance.toString());
}

main().catch((error) => {
  console.error("Error during interaction:", error);
  process.exitCode = 1;
});
