require('dotenv').config()
const { ethers }              = require("hardhat");

async function main() {
  let verifierAmount  = 1;

  let deployer        = await ethers.getSigner();
  let chainID         = await deployer.getChainId();

  // We get the contract to deploy
  const Verifier = await ethers.getContractFactory("CrosschainVerifier");
  const verifer = await Verifier.deploy(verifierAmount);
  
  console.log("Verifier deployed on ", verifer.address, "Deployer: ", deployer.address, "Chain ID: ", chainID);
}
  
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});
