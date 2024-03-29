import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { listSelectors, listRouters, one } from "../scripts/params";
import Deployments from "../scripts/deployments";
import { saveConstructorArgs } from "../scripts/constructor/set";

/**
 * Deploys a contract named "Registrar.sol" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const registrarContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const chainId = await hre.getChainId();

  const deployments = Deployments[chainId as keyof typeof Deployments][0];
  const sourceLib: string = deployments.contracts["SourceNftLib"].address;

  const networkParams = one(chainId);
  const destSelectors = listSelectors(chainId);
  const destRouters = listRouters(chainId);
  const constructorArgs = [networkParams.selector, networkParams.router, destSelectors, destRouters];
  saveConstructorArgs(hre.network.name, "Registrar", constructorArgs);
  await deploy("Registrar", {
    from: deployer,
    // Contract constructor arguments
    args: constructorArgs,
    log: true,
    libraries: {
      SourceNftLib: sourceLib,
    },
  });
};

export default registrarContract;

registrarContract.tags = ["Registrar"];
