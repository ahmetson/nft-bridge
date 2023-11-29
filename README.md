# [No code NFT bridge](#new-nft-bridge)
🧪 A trust-less, serverless NFT bridge framework with minimal setup.

To see the how to work with it, quickly go to the [Getting Started](#getting-started) section.

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

## Getting Started
**Assume you already deployed the original NFT in one of the [supporting blockchains](#supported-blockchains)**.

In order to bridge the NFT, first we need to be the owner of the NFT.
Either the NFT must be `Ownable` or we use the deployer's address.

Then, anyone can bridge their NFTs as they want.

### Library
The NFT bridge is available as an NPM package. The package has a LinkedNFT module, which should extend the original NFT.

The LinkedNFT constructor accepts the list of networks as its argument. The NFT will be minted in all the blockchains listed in the constructor.

## Supported Blockchains
Any blockchain supported by the Chainlink CCIP.

---
# Example
For example, I will create a simple NFT on remix using the LinkedNFT. After the deployment, let's mint the first NFT.
As you see, the NFT will be visible on various blockchains. Let's transfer the NFT on the second blockchain by selling it on OpenSea.
When another account buys the NFT, he will have it on both chains.

## Todo
singleton
custom parameters or functions
A script that deploys a custom NFT on various blockchains and links them together.
A nice UI to manage the Link tokens using Dex.

## Structure
Every blockchain must have two smartcontracts.
The one is the NFT and other one is the Factory.

The NFTs must be implemented using LinkedNFT.


The all supported contracts must deploy a factory.
This factory is responsible to deploy the nfts.

Then, the original NFT must be created using LinkedNft.

The nft must use the factory to have a permission to mint it.

