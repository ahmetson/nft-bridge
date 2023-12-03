import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { one, listSelectors, listRouters } from "../scripts/params";
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

  const chainId = parseInt(await hre.getChainId());
  const networkParams = one(chainId);
  const destSelectors = listSelectors(chainId);
  const destRouters = listRouters(chainId);
  const constructorArgs = [networkParams.selector, networkParams.router, destSelectors, destRouters];
  saveConstructorArgs(hre.network.name, "LinkedFactory", constructorArgs);
  await deploy("LinkedFactory", {
    from: deployer,
    // Contract constructor arguments
    args: constructorArgs,
    log: true,
  });
};

export default registrarContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags Registrar.sol
registrarContract.tags = ["Factory"];
