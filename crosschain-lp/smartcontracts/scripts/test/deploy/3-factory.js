require('dotenv').config()
const { ethers }              = require("hardhat");
const addr = require("./../../addresses");

async function main() {
  let deployer        = await ethers.getSigner();
  let chainID         = await deployer.getChainId();

  // We get the contract to deploy
  const Factory = await ethers.getContractFactory("CrosschainFactory");
  // address _feeToSetter, address _verifierManager, uint256 _firstChainID, uint256 _lastChainID, uint256 _lastOffset
  let feeToSetter = deployer.address;
  let veriferAddress = addr.addressOf(chainID, addr.alias.VERIFIER);
  let firstChainID;
  let lastChainID;
  let lastOffset;
  let oppsite = addr.oppositeOf(chainID);
  if (addr.offsetOf(chainID) === 0) {
    firstChainID = chainID;
    lastChainID = oppsite;
    lastOffset = 0;
  } else {
    firstChainID = oppsite;
    lastChainID = chainID;
    lastOffset = addr.offsetOf(chainID);
  }

  console.log(`Deploying factory on chain id ${chainID}`);
  console.log(`First chain ${chainID}, last chain ${lastChainID}.`);
  console.log(`Offset of chain id ${chainID} is ${lastOffset}\n`);

  const factory = await Factory.deploy(feeToSetter, veriferAddress, firstChainID, lastChainID, lastOffset);
  
  console.log("Factory deployed on ", factory.address, "Deployer: ", deployer.address, "Chain ID: ", chainID);
}
  
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});
