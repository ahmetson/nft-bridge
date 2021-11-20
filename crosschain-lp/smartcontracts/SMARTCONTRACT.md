# Crosschain LP Smartcontract instruction
This page describes the XDEX Smartcontract implementation.

It will be based on the [Uniswap V2](https://github.com/Uniswap/v2-core) smartcontracts.

Here are the changes we will add into the *Uniswap V2 smartcontracts*:

1. Creating Liquidity

* Address of the Crosschain Liquidity includes the Chain 0 ID, Token 0, Chain 1 ID, Token 1.
* The factory has the state of this part of *XDEX* in chain (first or last in blockchain placement).
* When added a crosschain liquidity, it passes to the Pair Part token the First or Last blockchain placement.
* We are adding the round of adding new Liquidity.
* We are adding pending mapping of Tokens assigned to the Uniswap pair data.
* We are separating creation of the new liquidity and addition of the new liquidity.