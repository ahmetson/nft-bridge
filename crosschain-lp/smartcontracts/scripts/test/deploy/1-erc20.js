require('dotenv').config()
const { ethers }              = require("hardhat");

async function main() {
  let totalSupply  = ethers.utils.parseEther("10000000");

  let deployer        = await ethers.getSigner();
  let chainID         = await deployer.getChainId();

  // We get the contract to deploy
  const Token = await ethers.getContractFactory("ERC20");
  const token = await Token.deploy(totalSupply);
  
  console.log("Token was deployed on ", token.address, "Deployer: ", deployer.address, "Chain ID: ", chainID);
}
  
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});
