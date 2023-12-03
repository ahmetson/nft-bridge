import { ethers } from "hardhat";

const calculateAddress = async () => {
  const WrappedNft = await ethers.getContractFactory("WrappedNft");
  const wrappedNft = WrappedNft.attach("0xf22ca298eef6f8562a2284d5d2ff2ed8f86f214a");

  const name = await wrappedNft.functions.name();
  const symbol = await wrappedNft.functions.symbol();
  console.log(`Wrapped NFT ${name}, symbol: ${symbol}`);
  const originalNft = await wrappedNft.functions.originalNft();
  const registrar = await wrappedNft.functions.registrar();
  const router = await wrappedNft.functions.router();
  console.log(`Chainlink router: ${router}, the parent: ${registrar}.`);
  console.log(`Wrapping ${originalNft}`);
  const allNfts = await wrappedNft.functions.allNfts();
  console.log(`All NFTs`, allNfts);
  const supportedNftChains = await wrappedNft.functions.nftSupportedChains(0);
  console.log(`Supported NFT Chain selectors`, supportedNftChains);
};

async function main() {
  calculateAddress();
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
