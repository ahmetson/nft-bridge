import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Registrar } from "../typechain-types";
import ChainlinkParamStruct = Registrar.ChainlinkParamStruct;

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

  // Main nets: Ethereum | Polygon | Avalanche C-Chain | BNB Chain
  // Test nets: Sepolia | Mumbai | Fuji | BNB Testnet
  const chainIds = [11155111, 80001, 1311, 97];
  const chainlinkParams: ChainlinkParamStruct[] = [
    { selector: "16015286601757825753", router: "0xd0daae2231e9cb96b94c8512223533293c3693bf" },
    { selector: "12532609583862916517", router: "0x70499c328e1e2a3c41108bd3730f6670a44595d1" },
    { selector: "14767482510784806043", router: "0x554472a2720e5e7d5d3c817529aba05eed5f82d8" },
    { selector: "13264668187771770619", router: "0x9527e2d01a3064ef6b50c1da1c0cc523803bcff2" },
  ];

  await deploy("Registrar.sol", {
    from: deployer,
    // Contract constructor arguments
    args: [chainIds, chainlinkParams],
    log: true,
  });
};

export default registrarContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags Registrar.sol
registrarContract.tags = ["Registrar.sol"];