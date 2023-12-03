import { task } from "hardhat/config";
import { chainIds, contractAddress, supportedNetworkParams, zeroAddr } from "../scripts/params";

type Args = {
  chainId: string;
  selector: string;
  factory: string;
};

task("set-factory")
  .setDescription("Lints the factories to the Registrar")
  .setAction(async function (taskArgs, hre) {
    const chainId = await hre.getChainId();

    const Registrar = await hre.ethers.getContractFactory("Registrar", {
      libraries: {
        SourceNftLib: contractAddress(chainId, "SourceNftLib"),
      },
    });
    const registrarAddr = contractAddress(chainId, "Registrar");
    if (registrarAddr.length === 0) {
      throw `No 'Registrar' found in ${chainId}`;
    }
    const registrar = Registrar.attach(registrarAddr);
    console.log(`Registrar '${registrarAddr}' in ${chainId}`);

    const destFactories = chainIds(chainId).reduce<Args[]>((destFactories, destChainId) => {
      const addr = contractAddress(destChainId, "LinkedFactory");
      if (addr.length == 0) {
        return destFactories;
      }
      const destArg: Args = {
        chainId: destChainId,
        selector: supportedNetworkParams[destChainId].selector,
        factory: addr,
      };
      destFactories.push(destArg);
      return destFactories;
    }, []);

    if (destFactories.length === 0) {
      console.log(`No factories to set`);
      return;
    }
    console.log(`There are ${destFactories.length} factories to set`);
    for (const factory of destFactories) {
      const networkParams = await registrar.functions["destNetworks"](factory.selector);
      if (networkParams.factory !== zeroAddr) {
        console.log(`Skipping ${factory.chainId} chain's factory as set`);
        continue;
      }
      const tx = await registrar.functions["setFactory(uint64,address)"](factory.selector, factory.factory);
      console.log(`Setting factory for ${factory.chainId}, deploying ${tx.hash}...`);
      await tx.wait();
      console.log(`Setting factory for ${factory.chainId} completed!`);
    }
  });
