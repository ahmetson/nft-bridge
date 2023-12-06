import React, { useState } from "react";
import Link from "next/link";
import { Abi } from "abitype";
import type { NextPage } from "next";
import { formatEther } from "viem";
import { useAccount, useNetwork } from "wagmi";
import { readContract, waitForTransaction, writeContract } from "wagmi/actions";
import { MetaHeader } from "~~/components/MetaHeader";
import { Spinner } from "~~/components/assets/Spinner";
import { TxnNotification, useDeployedContractInfo } from "~~/hooks/scaffold-eth";
import WrapperNft from "~~/utils/WrappedNft";
import { getTargetById, getTargetNetworks, notification } from "~~/utils/scaffold-eth";
import { ContractName } from "~~/utils/scaffold-eth/contract";

const registrarName = "Registrar" as ContractName;

const Setup: NextPage = () => {
  const { chain } = useNetwork();
  const { address, isConnecting, isDisconnected } = useAccount();

  const destNetworks = getTargetNetworks(chain?.id as number);
  const configuredNetwork = getTargetById(chain?.id as number);
  const { data: registrarData, isLoading: isRegistrarLoading } = useDeployedContractInfo(
    registrarName,
    chain?.id as number,
  );
  const [originalNft, setOriginalNft] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState(destNetworks[0].selector as string); // Declare a state variable...

  if (isConnecting || isDisconnected) {
    return (
      <div className="mt-14">
        <Spinner width="50px" height="50px" />
      </div>
    );
  }
  if (isRegistrarLoading) {
    return (
      <div className="mt-14">
        <Spinner width="50px" height="50px" />
      </div>
    );
  }

  if (!registrarData) {
    return (
      <p className="text-3xl mt-14">
        {`No contract found by the name of "${registrarName}" on chain "${configuredNetwork.name}"!`}
      </p>
    );
  }

  async function onClick() {
    let notificationId = notification.loading(<TxnNotification message="Checking the Wrapper" />);

    // first checking in the Registrar
    // then in the LinkedFactory.
    const wrapperAddress = await readContract({
      address: registrarData?.address as string,
      abi: registrarData?.abi as Abi,
      functionName: "linkedAddrs",
      args: [originalNft],
    });
    notification.remove(notificationId);
    if (wrapperAddress === "0x0000000000000000000000000000000000000000") {
      notification.error(<TxnNotification message={`NFT not wrapped. Register first`} />);
      return;
    }

    // Let's see that NFT is owned by the user.
    let owner = "";
    notificationId = notification.loading(<TxnNotification message="Validating NFT ownership" />);
    try {
      const res = await readContract({
        address: registrarData?.address as string,
        abi: registrarData?.abi as Abi,
        functionName: "nftAdmin",
        args: [originalNft],
      });
      owner = res as string;
    } catch (error: any) {
      notification.remove(notificationId);
      notification.error(<TxnNotification message={`Failed to fetch nft admin from registrar: ${error}`} />);
      return;
    }
    notification.remove(notificationId);
    if (owner?.toLowerCase() !== address?.toLowerCase()) {
      notification.error(<TxnNotification message={`You are not the admin of the NFT`} />);
      return;
    }

    if (selectedNetwork.length === 0) {
      notification.error(<TxnNotification message={`Select the destination`} />);
      return;
    }
    notificationId = notification.loading(<TxnNotification message="Validating target chain" />);
    let linkedNftAddr: `0x${string}`;
    try {
      linkedNftAddr = (await readContract({
        address: wrapperAddress as string,
        abi: WrapperNft as Abi,
        functionName: "linkedNfts",
        args: [selectedNetwork],
      })) as `0x${string}`;
    } catch (e: any) {
      notification.remove(notificationId);
      notification.error(<TxnNotification message={e.toString()} />);
      return;
    }
    notification.remove(notificationId);
    if (linkedNftAddr !== "0x0000000000000000000000000000000000000000") {
      notification.error(<TxnNotification message="The NFT already set up a link to the target blockchain" />);
    }

    const res0 = (await readContract({
      address: wrapperAddress as string,
      abi: WrapperNft as Abi,
      functionName: "nftSupportedChains",
      args: [0],
    })) as bigint;
    console.log(`first supported chain`, res0);

    const res1 = (await readContract({
      address: wrapperAddress as string,
      abi: WrapperNft as Abi,
      functionName: "nftSupportedChains",
      args: [1],
    })) as bigint;
    console.log(`second supported chain`, res1);

    const routerInWrapped = (await readContract({
      address: wrapperAddress as string,
      abi: WrapperNft as Abi,
      functionName: "router",
      args: [],
    })) as string;
    console.log(`router in wrapped nft`, routerInWrapped);

    const linked0 = (await readContract({
      address: wrapperAddress as string,
      abi: WrapperNft as Abi,
      functionName: "linkedNfts",
      args: [res0],
    })) as string;
    console.log(`first linked nft`, linked0);

    const linked1 = (await readContract({
      address: wrapperAddress as string,
      abi: WrapperNft as Abi,
      functionName: "linkedNfts",
      args: [res1],
    })) as string;
    console.log(`second linked nft`, linked1);

    console.log(`Wrapper`, wrapperAddress);

    return;
    // Calculating the fee.
    let createFee: bigint;
    notificationId = notification.loading(<TxnNotification message="Calculating the fee" />);
    try {
      createFee = (await readContract({
        address: registrarData?.address as string,
        abi: registrarData?.abi as Abi,
        functionName: "calculateCreateLinkedNftFee",
        args: [originalNft, selectedNetwork],
      })) as bigint;
    } catch (e: any) {
      notification.remove(notificationId);
      notification.error(<TxnNotification message={e.toString()} />);
      return;
    }

    /*
    let lintFee: bigint;
    try {
      lintFee = (await readContract({
        address: registrarData?.address as string,
        abi: registrarData?.abi as Abi,
        functionName: "calculateLinting",
        args: [originalNft],
      })) as bigint;
    } catch (e: any) {
      notification.remove(notificationId);
      notification.error(<TxnNotification message={e.toString()} />);
      return;
    }
    const totalFee = (lintFee + createFee);*/
    const totalFee = createFee;
    notification.remove(notificationId);

    // make sure it wasn't setup before
    notification.info(<TxnNotification message={`The fee would cost at least: ${formatEther(totalFee)}`} />);
    notificationId = notification.loading(
      <TxnNotification message={`Sign the transaction. It costs ${formatEther(totalFee)}`} />,
    );

    let hash: `0x${string}`;

    try {
      const { hash: signedHash } = await writeContract({
        address: registrarData?.address as string,
        abi: registrarData?.abi as Abi,
        functionName: "setup",
        args: [originalNft, selectedNetwork],
        value: totalFee * BigInt(3),
      });
      hash = signedHash;
    } catch (e: any) {
      notification.remove(notificationId);
      notification.error(<TxnNotification message={e.toString()} />);
      return;
    }

    notification.remove(notificationId);
    notificationId = notification.loading(
      <TxnNotification
        message={`Waiting for the confirmation: ${hash}`}
        blockExplorerLink={configuredNetwork.blockExplorers?.etherscan?.url + "/tx/" + hash}
      />,
    );

    await waitForTransaction({
      hash,
    });
    notification.remove(notificationId);

    const ccipExplorer = `https://ccip.chain.link/tx/${hash}`;
    notification.success(
      <TxnNotification
        message="The transaction subbmited to the Chainlink Oracles. Check on the explorer"
        blockExplorerLink={ccipExplorer}
      />,
    );
  }

  return (
    <>
      <MetaHeader
        title="Debug Contracts | Scaffold-ETH 2"
        description="Debug your deployed 🏗 Scaffold-ETH 2 contracts in an easy way"
      />
      <div className="flex justify-center items-center gap-12 flex-col sm:flex-row mt-20">
        <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
          <h1>Setup</h1>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">ORIGINAL NFT?</span>
            </div>
            <input
              type="text"
              placeholder="0x..."
              className="input input-bordered w-full max-w-xs"
              value={originalNft}
              onChange={e => setOriginalNft(e.target.value)}
            />
            <div className="stats">
              <div className="stat">
                <ul className="list-disc">
                  <li className="label-text-alt text-left">
                    NFT Must be{" "}
                    <Link href={"/register"} className={"bold bg-base-300"}>
                      Registered
                    </Link>
                  </li>
                  {/*<li className="label-text-alt text-left">:) Supports cross-chain, simply setup repeatedly</li>*/}
                </ul>
              </div>
            </div>
          </label>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Target</span>
            </div>
            <select
              name="dest-network"
              className="select select-bordered"
              value={selectedNetwork} // ...force the select's value to match the state variable...
              onChange={e => {
                console.error(e.target.value);
                setSelectedNetwork(e.target.value);
              }}
            >
              <option disabled selected>
                Select a network
              </option>
              {destNetworks.map(networkConf => {
                return (
                  <option key={networkConf.id} value={networkConf.selector} color={networkConf.color as string}>
                    {networkConf.name}
                  </option>
                );
              })}
            </select>
          </label>
          <label className="form-control w-full max-w-xs">
            <div className="label divider">COMPLETE</div>
            <button className="btn btn-primary" onClick={() => onClick()}>
              Setup
            </button>
            <div className="stats">
              <div className="stat">
                <ul className="list-disc">
                  {/*<li className="label-text-alt text-left">*/}
                  {/*  Setup creates a linked NFT on a target blockchain linked to all other Linked NFTs and Wrapped NFT.*/}
                  {/*</li>*/}
                  <li className="label-text-alt text-left">
                    Create an NFT on blockchain code(<span className="italic">{selectedNetwork}</span>) linked to the
                    NFT in <span className="italic">{configuredNetwork.name}</span>
                  </li>
                </ul>
              </div>
            </div>
          </label>
        </div>
      </div>
    </>
  );
};

export default Setup;
