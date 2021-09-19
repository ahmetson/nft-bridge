# PolkaFantasy's token linear vesting smart contracts
This repository contains the Token Linear Vesting smart contracts for PolkaFantasy project. This set of contracts has been created to automate the vesting process after PolkaFantasy's crowdsale.

## About the source code

The source code in this repo has been created from scratch but uses OpenZeppelin standard libraries for safety in basic operations and validations.

- [Getting Started](#getting-started)
  - [Requirements](#requirements)
  - [Deploy Vesting Period](#deploy-vesting-period)
  - [Deploy Token example (Testing purposes)](#deploy-token-example)
- [Troubleshooting](#troubleshooting)

## Getting Started

### Requirements
You will need node.js (12.* or later) and npm installed to run it locally. We are using Hardhat to handle the project configuration and deployment. The configuration file can be found as `hardhat.config.js`.

1. Import the repository and `cd` into the new directory.
2. Run `npm install`.
3. Copy the file `.env.example` to `.env`, and:
   - Replace `DEPLOYER_KEY` with the private key of your account.
   - Replace `RINKEBY_POLKA` with the address of the token contract you want to add vesting capabilities to.
   - Replace `REMOTE_HTTP` with an INFURA or ALCHEMY url.
   - Replace `RINKEBY_VESTING` with the address of an instance of the VestingPeriod contract.
   - Replace `ETHERSCAN_KEY` with a API key from etherscan.
5. Make sure you have gas to run the transactions and deploy the contracts in your account.
6. Define the network where you want to deploy it in `hardhat.config.js`.

### Deploy Vesting Period
Run `npx hardhat run scripts/deploy-vesting-period-script.js --network YOUR_NETWORK`

### Deploy Token example
Run `npx hardhat run scripts/deploy-token-example-script.js --network YOUR_NETWORK`

## Troubleshooting

If you have any questions, send them along with a hi to hello@dandelionlabs.io.
