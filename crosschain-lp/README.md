# Crosschain LP
The **Crosschain LP** is the MVP of the *Decentralized*, *Cross-chain* Token Exchanger. In short **XDEX**.

Let's call the user interaction with **XDEX** as *interaction*. In short **XDEX INTERACT**.

>There are three major *interactions* on any dex:
>
>* Add Liquidity
>* Remove Liquidity
>* Swap token
>
> **XDEX** also has those three **XDEX INTERACT**s.

The **XDEX INTERACT**s require atleast one transactions on each blockchain. Because **XDEX** is cross-chain. The **XDEX INTERACT** is *time based* and *blockchain order placed*.

The **XDEX** is also *round* based. Let's call it **XDEX ROUND**. Any **XDEX INTERACT** should be going within the **XDEX ROUND**. Each round takes around *6 minutes*. And user has to confirm the **XDEX INTERACT** transactions on both blockchains within the **XDEX ROUND** time frame. This requirement is called **time based**.

The **XDEX ROUND** time comes with the offset on one of the blockchains. Thus, user has to execute the first transaction on *Blockchain with Default Round Time*, then on the second *Blockchain with Offset Round Time*. Let's call the Blockchain with Default Round Time as **B1** and the Blockchain with Offset Round Time as **B2**.
Thus, any **XDEX INTERACT**'s transactions should be running first on **B1**, then on **B2**. This requirement is called *blockchain order placed*.

Among blockchains that **XDEX** should be going to support, the Blockchains are defining the *Blockchain Pair*. One of the blockchains in *Blockchain Pair* should be **B1**, and another blockchain in *Blockchain Pair* should be **B2**. How do **B1** and **B2** defined in *Blockchain Pair*? The blockchain with the fastest Block confirmation time in the *Blockchain Pair* is defined as **B1**, and the blockchain with slowest Block confirmation time in the *Blockchain Pair* is defined as **B2**.

>As an example, let's say **XDEX** has a Liquidity pair between Ethereum and Binance Smart Chain. 
>
>The average Block confirmation time on Ethereum Blockchain is 15 seconds. 
The average Block confiration time on Binance Smart Chain is 4 seconds.
> 
>Thus, Binance Smart Chain will be **B1**, while Ethereum will be **B2**.


---


## XDEX INTERACT
Let's go through the **XDEX INTERACT**'s technical process.

On **B1**, a user submits a Transaction in the *round 1*. *Round 1* on **B1** in short will be **R11**. This Transaction is accepted by **XDEX** smartcontracts as *Pending* interaction.
Then, a user submits another Transaction on *B2* in the *round 1*. *Round 1* on **B2** in short will be **R21**. This Transaction is accepted by **XDEX** smartcontracts as *Pending* interaction.

After the end of *Round 1*, the verifier grabs the data from smartcontractson from **B1** and **B2**. In short verifier will be **VERIF**. The **VERIF** verifies the pending interactions, then pushes back to *XDEX* smartcontracts the *Round 1* update on both blockchains.

The update from **VERIF** changes the state of **INTERACT** from *Pending* to *Active*.

The **VERIF** waits for 12 blocks since the end of *Round 1* on **B2**, to avoid the *Hard fork* issue.


---


## Price Change Considerations

> NOTICE
> For the user, the Tokens that users would get after Round end maybe different than what user expects to have.
>
> For example, it may happen, if **VERIF** delayed the push on one of the blockchains the Round updates. While user calculates the price from Another Blockchain with the recent Round.

On the interface, we show the Expected tokens for swapping as the *Range of Tokens*. The minimum part of the *Range of Tokens* is based on *Active* Liquidity. The maxium part of the *Range of Tokens* is based on *Pending* Liquidity.

**The interface alsow should show a *warning* that if user changes the network to the next blockchain, then the Price Range could be different**. As it was mentioned above in `NOTICE` blockout, **B2** could hae one ore more than one *Active* liquidity due to successful push by **VERIF**. Meanwhile, **B1** could have older *Active* liquidity, due to **VERIF** push failure.

**The warning** should say **Exact asked tokens for swapping are not guaranteed, due to other Pending Liquidities in this round**. Therefore, **it's recommended to expect the price close the Minimum of the *Price of Tokens***.

The interface also shows the *Round* time. If user is trying to create a *Pending* interaction when for end of a *Round* remaines less than 60 seconds or 1/3 of the *Round* time, then **website recommends to wait for the next Round**. Because, by end of the *Round*, one side of *Pending* Transaction could fail due to *Low Gas Price*.

> RESEARCH
> If its possible to connect to **B2** or **B1** while user is connected to one of them from his wallet, then let's do this way to improve the *User experience*. The switching Network is always uncomfortable from the user's perspective.
>
> My worry is, signing Raw transaction from the *Wallet Provider* that is connected to the website could include into transaction the *CHAIN_ID*. 
> We need to do a research.


---

## ROUND VERIFICATION

**VERIF** puts the reorganized pool of *Pending* interactions back to the blockchains.

Reorganization goes in this critera:

```
let weight = (Round Time - (Transaction timestamp of *Pending* interaction on **B2** - Transaction timestamp of *Pending* interaction on **B1**)) 

let reorganizedOrder = 
    weight * 
    Transaction timestamp of *Pending* interaction on **B1** *
    Transaction timestamp of *Pending* interaction on **B2**.
```

For example, the first **XDEX INTERACT** by the user 1 has 18 seconds between *Pending* interaction on **B1** and *Pending* interaction on **B2**.
The second **XDEX INTERACT** by the user 2 has 5 seconds between *Pending* interaction on **B1** and *Pending* interaction on **B2**.
Then, in reorganized order of *Pending* interactions, the second user's *XDEX INTERACT** will be first to take in execution than the first user's **XDEX INTERACT**.

The *Pending* interactions without the second *Pending* interaction on another blockchain within the same *Round* will be withdrawn from the reorganized pool of interactions.

**VERIF** pushes two list of changes to the Blockchains. The first list is an array of reorganized *Pending* interactions, while the second list is an array of withdrawable *Pending* interactions.


---

## Economy And Fees

The token swap **XDEX INTERACT** is charged of 0.3% fee on top of Token swap to the **XDEX**. From 0.3% fee, 85 percent, or 0.25% goes to Liquidity Providers. From 0.3% fee, 15 percent, or 0.05% goes to the **VERIF** nodes.

Among **VERIF** fee, the fees collected in a one round, in every ten rounds goes to **SEADEX** developers. 