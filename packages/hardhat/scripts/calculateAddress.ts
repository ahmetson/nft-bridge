import { ethers } from "hardhat";

const calculateAddress = async () => {
  console.log("👛 Calculating the address");
  const signers = await ethers.getSigners();
  const chainId = await signers[0].getChainId();

  const Registrar = await ethers.getContract("Registrar");
  const RegistrarFactory = await ethers.getContractFactory("Registrar");
  const registrar = RegistrarFactory.attach(Registrar.address);

  // parameters
  const nftAddress = "0xd1d5b8Ea43f07e5e127D97652C9924Fa6372809a";

  let opponentChainId = 80001;
  let opponentAddr = "0xEBB151AfE7f1f52cBF68fed5e2Ec8a08cBe235fb";

  if (chainId === 11155111) {
    opponentChainId = 80001;
    opponentAddr = "0xe40c7856b6d0e1b01decbf9976bb706b9cd1229f";
  } else if (chainId === 80001) {
    opponentChainId = 11155111;
    opponentAddr = "0xEBB151AfE7f1f52cBF68fed5e2Ec8a08cBe235fb";
  } else {
    throw Error(`unsupported chain id ${chainId}`);
  }

  // Calculate the address
  console.log(`Chain ID: ${chainId}, Registrar: ${registrar.address}`);
  console.log(`Dest Chain ID: ${opponentChainId}, Registrar: ${opponentAddr}`);

  console.log(`\nNFT: ${nftAddress}.`);
  const myAddr = await registrar["calculateAddress(address)"](nftAddress);
  console.log(`NFT in ${chainId} for ${chainId} is ${myAddr}`);
  const opponentMyAddr = await registrar["calculateAddress(uint256,address)"](opponentChainId, nftAddress);
  console.log(`NFT in ${chainId} for ${opponentChainId} is ${opponentMyAddr}`);
};

async function main() {
  calculateAddress();
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
