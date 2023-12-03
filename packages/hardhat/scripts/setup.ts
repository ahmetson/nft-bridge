import { ethers } from "hardhat";
import { contractAddress, zeroAddr } from "./params";

const calculateAddress = async () => {
  const accounts = await ethers.getSigners();
  const chainId = await accounts[0].getChainId();
  const registrarAddr = contractAddress(chainId.toString(), "Registrar");
  const sourceNftAddr = contractAddress(chainId.toString(), "SourceNftLib");
  const Registrar = await ethers.getContractFactory("Registrar", {
    libraries: {
      SourceNftLib: sourceNftAddr,
    },
  });
  const registrar = Registrar.attach(registrarAddr);
  const WrappedNft = await ethers.getContractFactory("WrappedNft");
  const wrappedNft = WrappedNft.attach("0x574fD4021b46f3D73Dc8260f65629a2B8B1F407F");
  const LinkedFactory = await ethers.getContractFactory("LinkedFactory");
  const linkedFactory = LinkedFactory.attach(contractAddress(chainId.toString(), "LinkedFactory"));
  const nftAddr = "0x5660fc9457358639DAdfD05FEC21070B973d277d";
  const destSelector = "0xADECC60412CE25A5";

  const destParams = await registrar.functions.destNetworks(destSelector);
  console.log(`Factory in ${destSelector} chain as the receiver of a signal: ${destParams.factory}`);
  const factoryAddr = await registrar.functions.factory();
  console.log(`Factory in this chain: ${factoryAddr}`);
  let linkedNftAddr = await wrappedNft.functions.linkedNfts(destSelector);
  console.log(`Linked NFT to ${destSelector} selector: ${linkedNftAddr}. Is Zero? ${linkedNftAddr == zeroAddr}`);
  const destRouter = destParams["router"];
  if (factoryAddr == zeroAddr) {
    return;
  }
  const name = await wrappedNft.functions.name();
  const symbol = await wrappedNft.functions.symbol();
  const linkedFactoryRouter = await linkedFactory.functions.router();
  console.log(`Router in the linked factory: ${linkedFactoryRouter}`);
  console.log(
    `precompute linked nft with ['${destParams.factory}', '${name}', '${symbol}', '${nftAddr}', '${destRouter}']`,
  );
  linkedNftAddr = await linkedFactory.functions.precomputeLinkedNft(
    destParams.factory,
    name,
    symbol,
    nftAddr,
    destRouter,
  );
  console.log(`Linked nft address: ${linkedNftAddr}`);
};

async function main() {
  calculateAddress();
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
