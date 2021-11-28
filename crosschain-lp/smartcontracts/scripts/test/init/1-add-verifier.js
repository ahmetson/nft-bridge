require('dotenv').config()
const { ethers }              = require("hardhat");
const addr = require("./../../addresses");

async function main() {
  let deployer        = await ethers.getSigner();
  let chainID         = await deployer.getChainId();

  let verifierAddress = addr.addressOf(chainID, addr.alias.VERIFIER);

  // We get the contract to deploy
  const Verifier = await ethers.getContractFactory("CrosschainVerifier");
  const verifer = await Verifier.attach(verifierAddress);
  
  let tx = await verifer.addVerifier(deployer.address);
  console.log(`Deployer of the Verifier Manager added as the verifier. Tx ${tx.hash}`);
}
  
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});
