# [No code NFT bridge](#new-nft-bridge)
🧪 A trust-less, serverless NFT bridge framework with minimal setup.

**To start quickly, go to the [Getting Started](#getting-started) section.**

Made for the hackathon for the MVP.

Features:
* :heart_eyes: **Simple**. Whole bridge is 4 smartcontracts only.
* :sparkles: **Easy setup**. Deploy a single NFT in one blockchain, it will create smartcontracts automatically.
* :earth_asia: **Multi-chain**. Transfer between many blockchains.
* :game_die: **Decentralized and secure**. Bridge directly from NFT itself. No single manager.

# Supported Blockchains
It's not production ready, yet. So only available on the Testnet.

The NFT Bridge uses Chainlink CCIP as the middleware solution.
Therefore, its availabe in the blockchains supported by Chainlink CCIP.

* Sepolia Testnet
* Mumbai Testnet
* Fuji Testnet
* BNB Chain Testnet

Visit official Chainlink documentations for a list of networks:
[CCIP Supported Networks Testnet](https://docs.chain.link/ccip/supported-networks/testnet)

# Version 0
The [version 0](https://github.com/ahmetson/nft-bridge/tree/chainlink-function)
was implemented for [Ethglobal 2021 Hackathon](https://ethglobal.com/showcase/nft-bridge-tk299) using chainlink oracles.

For me, Chainlink CCIP was the best candidate to improve the NFT Bridge.
At that time it wasn't launched. So with this hackathon
I finally want to release the more secure NFT Bridge.

> I signed up for the announcements.
>
> I joined to the early access.
>
> Within two years I messaged several times Chainlink,
> about the news regarding CCIP but no response.

--- 
# 🔥New NFT Bridge
A new NFT Bridge solves all the issues of the first version.


| Category        | Version 0                                | New NFT Bridge                                          |
|-----------------|------------------------------------------|---------------------------------------------------------|
| **Development** | Requires to deploy smartcontracts        | :blush: **No setup***                                   |
| **UI**          | Multiple transactions, switching network | :satisfied: **Single transaction**                      |
| **Middleware**  | Custom API in a centralized server       | :evergreen_tree: **Decentralized Oracle Network (DON)** |

:blush: *No setup &ndash; If your NFT has additional parameter besides ERC721 standard, then
there is needed a minimal setup. Otherwise, no code is needed.*

---

# Getting Started

## 0. Pre-requirements
Deploy your NFT on the original chain.

***Required** to have the smartcontract that's [Ownable](https://docs.openzeppelin.com/contracts/5.x/access-control#ownership-and-ownable).*

> [AccessControl](https://docs.openzeppelin.com/contracts/5.x/access-control#role-based-access-control) not supported YET.
>
> [AccessManager](https://docs.openzeppelin.com/contracts/5.x/access-control#using_accessmanager) not supported YET.
>
> **Contract Creator** not supported yet.
>
> Custom owner mechanism not supported yet.

## 1. Register
> **Only owner of NFT contract allowed.**

First, step is the original NFT must be *registered* by the NFT Bridge.
At the registration process, the NFT Bridge identifies the owner, creates the wrapper
for the nft. That contract later will be used to bridge the nfts.

Visit the [nft-bridge.net/](https://nft-bridge.net/).

Connect your wallet.

Go to [Register/](https://nft-bridge.net/register) page.

Switch to the blockchain network where your NFT deployed in.

At the *register* page, pass the NFT address in the edit field.

Click the button to register the nft.

## 2. Set up a linked NFT.
> **Only owner of NFT contract allowed.**

> **NFT Must be registered. If you didn't register,
> then go to [1. register](#1-register) step first.**

The second step is to set up a linked NFT.
The linked NFT is your NFT on another chain connected to the wrapper.

During the setup, the bridge deploys the NFT on another blockchain,
then lints the NFT address with the wrapper.

The linted NFT and the wrapper are composing a Bridged NFT that
works directly without third party smartcontracts.

To set up, go to the [nft-bridge.net/admin](https://nft-bridge.net/admin) page.

Select the NFT from the registered NFTs list. Click on "Setup".

In the popup, select the target blockchain and submit the transaction.

:sparkler: **Congratulations.** It's time to bridge the nft.

## 3. Bridge
> :sunglasses: **Anyone who has NFT**

To bridge, we created a simplified dashboard.
*But you can create your own, or interact with the smartcontract directly*.

Visit the [nft-bridge.net] website. Connect your wallet.
Visit the [nft-bridge/bridge] web page.

To bridge, select the NFT from the list.

Define the destination blockchain, then click to submit button.

If it's your first interaction, then approve NFT Bridge to use your NFTs.

Then click on the submit.

After successful transaction you will see the Bridged NFT, and your NFT was disappeared.

Check your balance on the destination chain, and you will see your NFT there.

### 3.2 Multi chain bridging
NFT Bridge supports multi-chains.

*The admin of the NFT can setup a linked NFT by following (#2-setup)[#2-setup] step.*

The steps are identical as in the [#3-bridge](#3-bridge) step.

You just need to switch your network to the place where you have your NFTs in.

If you select the original blockchain as the destination, then
NFT will be unwrapped and transferred to your balance.

---
# Structure
This NFT Bridge is consisted of **smartcontracts** and **web ui** only.
No backend, nothing else.


## Smartcontracts
The project consists several smartcontracts.
They all must be identical in every chain.

The smartcontract methods can be categorized into two functionalities.
The functionalities are defined in the [Getting-Started](#getting-started) as steps 1..3.

Obviously the most important functionality is the Bridging one.
The bridging functionality is configured as almost identical two smartcontracts.

The second functionality is automatic deploying of the NFTs and linting them.

### Smartcontracts for bridging functionality

#### Wrapped NFT
> Source Code: [WrappedNft.sol](./packages/hardhat/contracts/WrappedNft.sol)

The smartcontract locks the original NFT.
Then sends a message across blockchains to mint the NFT on another blockchain.

#### Linked NFT
> Source Code: [LinkedNft.sol](./packages/hardhat/contracts/LinkedNft.sol)

Linked NFT is copy of the original NFT on other blockchains.
The difference from the original NFT is that this NFT comes with built-in bridging functionality.

### Smartcontracts for setup functionality

#### Registrar
> Source Code: [Registrar.sol](./packages/hardhat/contracts/Registrar.sol)

A smartcontract that creates the [WrappedNFT](#wrapped-nft).
It also has the functionality to bridge NFTs across the blockchains.

Only admin of the NFT is able to interact with this smartcontract.

#### LinkedFactory
> Source Code: [LinkedFactory.sol](./packages/hardhat/contracts/LinkedFactory.sol)

A smartcontract that creates the [LinkedNft](#linked-nft).
This smartcontract is not callable. 
Only [registrar](#registrar) is able to invoke it from other blockchain.


## API
The list of methods

| Smartcontract | Permission | Method        | Description                                                     | Arguments                                                                     |
|---------------|------------|---------------|-----------------------------------------------------------------|-------------------------------------------------------------------------------|
| Registrar     | NftAdmin   | setup         | Registers a new nft.<br/>Creates smartcontracts across networks | Accepts the NFT address, deployment <br/>transaction and list of destinations |
| Registrar     | Admin      | withdraw      | Withdraws the fees collected from the nft minting               | No arguments                                                                  |
| Registrar     | Oracle     | xSetup        | Registers a linked nft                                          | Accepts the address of the chain ids and original nft address                 |
| Wrapped NFT   | Anyone     | xTransferTo   | Wraps the NFT as a locked NFT and mints in the destination      | Accepts the destination                                                       |
| Wrapped NFT   | Oracle     | unwrap        | Asks to transfer the NFT to the given address                   | Accepts the address of the owner                                              |
| Linked NFT    | Anyone     | xTransferTo   | Burns the NFT and transfers to the destination                  | Accepts the destination                                                       |
| Wrapped NFT   | Oracle     | xTransferFrom | Mints the NFT and transfers to the given address                | Accepts the address of the new owner                                          |

Permissions
* NftAdmin &ndash; an owner or the deployer of the nft.
* Admin &ndash; a deployer of the Nft Bridge
* Oracle &ndash; a chainlink CCIP oracle
* Anyone &ndash; owner of the nft.

---
# Bridging Demo 
I will create a simple NFT on remix on Sepolia. I mint two nfts to the user.

Then I will go to the website dashboard and set it as setup it to Mumbai.

Once it's done, I will switch on dashboard to the bridge.

In the bridge, I approve.
Then I send my first nft to Mumbai.

On Mumbai network, I put the NFT on sale on OpenSea.

Switching account, then buying the NFT it.

I transfer the NFT to Sepolia network again.

I see unwrapped NFT in my account.

## Multi-chain bridging
In the dashboard, I set up the NFT to Fuji testnet.

I bridge the NFT to Fuji.
Switching the network, I bridge the NFT to Mumbai.
Switching the network, I bridge the NFT from Mumbai to Sepolia.

The unwrapped NFT is in my account again.

# Install

1. Deploy the Library
`yarn deploy --tags Libs --network sepolia --export-all ./scripts/deployments.ts`

2. Verify

`yarn verify-custom --network sepolia <lib_library>`

2. Deploy registrar: 

`yarn deploy --tags Registrar --network sepolia --export-all ./scripts/deployments.ts`

3. Verify the registrar

`yarn verify-custom --network sepolia ${address} --constructor-args scripts/constructor/sepolia_registrar.ts`

4. Deploy Linked Factory

`yarn deploy --tags Factory --network sepolia --export-all ./scripts/deployments.ts`

5. Verify Linked Factory in sepolia

`yarn verify-custom --network sepolia ${address} --constructor-args scripts/constructor/sepolia_linkedfactory.ts`

6. Deploy Linked Factory in mumbai

`yarn deploy --tags Factory --network polygonMumbai --export-all ./scripts/deployments.ts`

7. Verify Linked Factory in mumbai
`yarn verify-custom --network polygonMumbai ${address} --constructor-args scripts/constructor/polygonmumbai_linkedfactory.ts`

8. Let Registrar know the deployed Link Factory smartcontracts. :)

`yarn set-factory`

> Let Linked Factory know the registrars

Deploy:
In the root.
`yarn deploy --tags Factory --network polygonMumbai --export-all ./scripts/deployments.ts`

Verify:
In the hardhat package
`npx hardhat --network polygonMumbai 0xCb3B96E8c57E90b8B74959c8475cD3245D02f053 --constructor-args scripts/constructor/polygonmumbai_linkedfactory.ts`


8. Export deployments to the frontend

Duplicate `packages/hardhat/scripts/deployments.ts`
to `packages/nextjs/utils/deployment.ts`.