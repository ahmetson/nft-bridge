import { task } from "hardhat/config";
import { chainIds, contractAddress, supportedNetworkParams, zeroAddr } from "../scripts/params";

type Args = {
  chainId: string;
  selector: string;
  registrar: string;
};

task("set-registrar")
  .setDescription("Lints the registrar to the LinkedFactory")
  .setAction(async function (taskArgs, hre) {
    const chainId = await hre.getChainId();

    const LinkedFactory = await hre.ethers.getContractFactory("LinkedFactory", {});
    const linkedFactoryAddr = contractAddress(chainId, "LinkedFactory");
    if (linkedFactoryAddr.length === 0) {
      throw `No 'LinkedFactory' found in ${chainId}`;
    }
    const linkedFactory = LinkedFactory.attach(linkedFactoryAddr);
    console.log(`LinkedFactory '${linkedFactoryAddr}' in ${chainId}`);

    const destRegistrars = chainIds(chainId).reduce<Args[]>((destRegistrars, destChainId) => {
      const addr = contractAddress(destChainId, "Registrar");
      if (addr.length == 0) {
        return destRegistrars;
      }
      const destArg: Args = {
        chainId: destChainId,
        selector: supportedNetworkParams[destChainId].selector,
        registrar: addr,
      };
      destRegistrars.push(destArg);
      return destRegistrars;
    }, []);

    if (destRegistrars.length === 0) {
      console.log(`No registrars to set`);
      return;
    }
    console.log(`There are ${destRegistrars.length} registrars to set`);
    for (const registrar of destRegistrars) {
      const networkParams = await linkedFactory.functions["destNetworks"](registrar.selector);
      if (networkParams.registrar !== zeroAddr) {
        console.log(`Skipping ${registrar.chainId} chain's factory as set`);
        continue;
      }
      const tx = await linkedFactory.functions["setRegistrar(uint64,address)"](registrar.selector, registrar.registrar);
      console.log(`Setting registrar for ${registrar.chainId}, deploying ${tx.hash}...`);
      await tx.wait();
      console.log(`Setting registrar for ${registrar.chainId} completed!`);
    }
  });
