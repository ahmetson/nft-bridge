import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { listSelectors, listRouters, one } from "../scripts/params";
import * as net from "net";

type NetworkParams = {
  selector: number | string;
  router: string;
  registrar: string;
};

/**
 * Deploys a contract named "Registrar.sol" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const registrarContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
    On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

    When deploying to live networks (e.g `yarn deploy --network goerli`), the deployer account
    should have sufficient balance to pay for the gas fees for contract creation.

    You can generate a random account with `yarn generate` which will fill DEPLOYER_PRIVATE_KEY
    with a random private key in the .env file (then used on hardhat.config.ts)
    You can run the `yarn account` command to check your balance in every network.
  */
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const chainId = parseInt(await hre.getChainId());

  const networkParams = one(chainId);
  const destSelectors = listSelectors(chainId);
  const destRouters = listRouters(chainId);
  await deploy("Registrar", {
    from: deployer,
    // Contract constructor arguments
    args: [networkParams.selector, networkParams.router, destSelectors, destRouters],
    log: true,
  });
};

export default registrarContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags Registrar.sol
registrarContract.tags = ["Registrar.sol"];
