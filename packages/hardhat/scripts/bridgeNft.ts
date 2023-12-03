import { ethers } from "hardhat";
import { supportedNetworkParams } from "./params";

const calculateAddress = async () => {
  const WrappedNft = await ethers.getContractFactory("WrappedNft");
  const wrappedNft = WrappedNft.attach("0xf22ca298eef6f8562a2284d5d2ff2ed8f86f214a");

  const nftId: number = 1;
  const destChainId = "80001";
  const destParams = supportedNetworkParams[destChainId];
  console.log(`Bridging NFT ${nftId} to ${destChainId}. The dest selector: ${destParams.selector}`);

  // const wrappedOwner = await wrappedNft.functions.ownerOf(nftId);
  // console.log(`Owner of wrapped ${nftId}: ${wrappedOwner}`);
  const linkedNftAddr = await wrappedNft.functions.linkedNfts(destParams.selector);
  console.log(`The Linked NFT on ${destChainId} is ${linkedNftAddr}`);

  const tx = await wrappedNft.functions["bridge(uint256,uint64)"](nftId, destParams.selector, {
    value: ethers.utils.parseEther("0.01"),
  });
  console.log(`Bridging ${nftId} NFT to ${destChainId} blockchain...${tx.hash}`);
  await tx.wait();
  console.log(`Bridged!`);
};

async function main() {
  calculateAddress();
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
