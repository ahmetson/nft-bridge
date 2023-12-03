import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

/**
 * Deploys a contract named "Registrar.sol" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const libs: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("SourceNftLib", {
    from: deployer,
    // Contract constructor arguments
    args: [],
    log: true,
  });
};

export default libs;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags Registrar.sol
libs.tags = ["Libs"];
