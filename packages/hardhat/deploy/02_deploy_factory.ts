import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { one, listSelectors, listRouters } from "../scripts/params";

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
  await deploy("LinkedFactory", {
    from: deployer,
    // Contract constructor arguments
    args: [networkParams.selector, networkParams.router, destSelectors, destRouters],
    log: true,
  });
};

export default registrarContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags Registrar.sol
registrarContract.tags = ["Factory"];
