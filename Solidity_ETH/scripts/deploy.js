const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contract with the account:", deployer.address);

  // Creează fabrica pentru contract
  const IBTToken = await ethers.getContractFactory("IBTToken");

  // Deployează contractul
  const token = await IBTToken.deploy(deployer.address);

  // Verifică obiectul contractului
//   console.log("Contract object:", token);

  // Utilizează `BaseContract.target` ca fallback pentru adresă
  const contractAddress = token.target || token.address || "undefined";
  console.log(`Contract deployed successfully! Address: ${contractAddress}`);
}

main().catch((error) => {
  console.error("Error during deployment:", error);
  process.exitCode = 1;
});
