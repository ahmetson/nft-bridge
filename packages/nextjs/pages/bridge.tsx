import React, { useState } from "react";
import Link from "next/link";
import { Abi } from "abitype";
import type { NextPage } from "next";
import { formatEther } from "viem";
import { useNetwork } from "wagmi";
import { useAccount } from "wagmi";
import { readContract, waitForTransaction, writeContract } from "wagmi/actions";
import { MetaHeader } from "~~/components/MetaHeader";
import { Spinner } from "~~/components/assets/Spinner";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";
import { TxnNotification } from "~~/hooks/scaffold-eth";
import WrapperNft from "~~/utils/WrappedNft";
import { getTargetById, getTargetNetworks } from "~~/utils/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";
import { ContractName } from "~~/utils/scaffold-eth/contract";

// simply to retrieve the wrapper info: LinkedFactory and Registrars must be same
const managerNames = ["Registrar", "LinkedFactory"] as Array<ContractName>;

const Bridge: NextPage = () => {
  const { chain } = useNetwork();
  const { address, isConnecting, isDisconnected } = useAccount();

  const destNetworks = getTargetNetworks(chain?.id as number);
  const configuredNetwork = getTargetById(chain?.id as number);
  const { data: registrarData, isLoading: isRegistrarLoading } = useDeployedContractInfo(
    managerNames[0],
    chain?.id as number,
  );
  const [originalNft, setOriginalNft] = useState("");
  const [nftId, setNftId] = useState(0);
  const [selectedNetwork, setSelectedNetwork] = useState(destNetworks[0].selector as string); // Declare a state variable...

  const { data: linkedFactoryData, isLoading: isLinkedFactoryLoading } = useDeployedContractInfo(
    managerNames[1],
    chain?.id as number,
  );

  if (isConnecting || isDisconnected) {
    return (
      <div className="mt-14">
        <Spinner width="50px" height="50px" />
      </div>
    );
  }
  if (isRegistrarLoading || isLinkedFactoryLoading) {
    return (
      <div className="mt-14">
        <Spinner width="50px" height="50px" />
      </div>
    );
  }

  if (!registrarData) {
    return (
      <p className="text-3xl mt-14">
        {`No contract found by the name of "${managerNames[0]}" on chain "${configuredNetwork.name}"!`}
      </p>
    );
  }

  if (!linkedFactoryData) {
    return (
      <p className="text-3xl mt-14">
        {`No contract found by the name of "${managerNames[1]}" on chain "${configuredNetwork.name}"!`}
      </p>
    );
  }
  async function onClick() {
    let origSource = true; // true, if bridging from the original

    if (selectedNetwork.length === 0) {
      notification.error(<TxnNotification message={`Select the destination`} />);
      return;
    }

    let notificationId = notification.loading(<TxnNotification message="Checking the Wrapper" />);

    let wrapperAddress = await readContract({
      address: registrarData?.address as string,
      abi: registrarData?.abi as Abi,
      functionName: "linkedAddrs", // todo change to linkedAddrs
      args: [originalNft],
    });

    notification.remove(notificationId);
    if (wrapperAddress === "0x0000000000000000000000000000000000000000") {
      wrapperAddress = (await readContract({
        address: linkedFactoryData?.address as string,
        abi: linkedFactoryData?.abi as Abi,
        functionName: "linkedAddrs", // todo change to linkedAddrs
        args: [originalNft],
      })) as string;

      if (wrapperAddress === "0x0000000000000000000000000000000000000000") {
        notificationId = notification.error(
          <TxnNotification message="Contract not bridged. Contact to the NFT owner" />,
        );
        return;
      }
      origSource = false;
    }

    // Identify is it the original chain or not.
    // const originalChainSelector = (await readContract({
    //   address: wrapperAddress as string,
    //   abi: WrapperNft as Abi,
    //   functionName: "nftSupportedChains", // todo change to linkedAddrs
    //   args: [0],
    // })) as bigint;

    // Let's see that NFT is owned by the user.
    let owner = "";
    notificationId = notification.loading(<TxnNotification message="Validating NFT ownership" />);
    try {
      const res = await readContract({
        address: origSource ? (originalNft as string) : (wrapperAddress as string),
        abi: WrapperNft as Abi,
        functionName: "ownerOf",
        args: [nftId],
      });
      owner = res as string;
    } catch (error: any) {
      notification.remove(notificationId);
      notification.error(<TxnNotification message={`Failed to fetch nft owner: ${error}`} />);
      return;
    }
    notification.remove(notificationId);
    if (owner?.toLowerCase() !== address?.toLowerCase()) {
      notification.error(<TxnNotification message={`You are not the owner of the NFT`} />);
      return;
    }

    // Let's check that user approved if it's the original chain
    if (origSource) {
      let approvedForAll = false;
      notificationId = notification.loading(<TxnNotification message="Validating NFT approval" />);
      try {
        const res = await readContract({
          address: originalNft,
          abi: WrapperNft as Abi,
          functionName: "isApprovedForAll",
          args: [address, wrapperAddress],
        });
        approvedForAll = res as boolean;
      } catch (error: any) {
        notification.remove(notificationId);
        notification.error(<TxnNotification message={`Failed to fetch nft approval: ${error}`} />);
        return;
      }
      notification.remove(notificationId);
      if (!approvedForAll) {
        notification.error(<TxnNotification message={`You didn't approve your nft to bridge.`} />);
        return;
      }
    }

    // Calculating the fee.
    let bridgeFee: bigint;
    notificationId = notification.loading(<TxnNotification message="Calculating the fee" />);

    try {
      bridgeFee = (await readContract({
        address: wrapperAddress as string,
        abi: WrapperNft as Abi,
        functionName: "calculateBridgeFee",
        args: [nftId, selectedNetwork],
      })) as bigint;
    } catch (e: any) {
      notification.remove(notificationId);
      notification.error(<TxnNotification message={e.toString()} />);
      return;
    }

    notification.remove(notificationId);
    notification.info(
      <TxnNotification
        message={`Bridging costs ${formatEther(bridgeFee)} ${configuredNetwork.nativeCurrency.symbol}`}
      />,
    );

    notificationId = notification.loading(<TxnNotification message="Sign the transaction" />);

    let hash: `0x${string}`;

    // bridge to the wrapper uses different args
    notification.warning(<TxnNotification message="Redeploy the smartcontracts to calculate the fee" />);

    try {
      const { hash: signedHash } = await writeContract({
        address: wrapperAddress as string,
        abi: WrapperNft as Abi,
        functionName: "bridge",
        args: [nftId, selectedNetwork],
        value: bridgeFee,
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
        message="Waiting for the confirmation"
        blockExplorerLink={configuredNetwork.blockExplorers?.default + hash}
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
          <h1>Bridge</h1>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">NFT ADDRESS?</span>
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
                    You are in <span className="italic">{configuredNetwork.name}</span>
                    <br />
                    NFTs must be in <span className="italic">{configuredNetwork.name}</span> or change the network in
                    your wallet.
                  </li>
                  <li className="label-text-alt text-left">
                    To bridge original blockchain, the NFT must be{" "}
                    <Link href={"/approve"} className="italic bg-base-300">
                      approved
                    </Link>
                  </li>
                  <li className="label-text-alt text-left">
                    Its <span className={"bold"}>Free</span>
                  </li>
                </ul>
              </div>
            </div>
          </label>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">NFT ID</span>
            </div>
            <input
              type="number"
              placeholder="1"
              min={0}
              className="input input-bordered w-full max-w-xs"
              value={nftId}
              onChange={e => setNftId(parseInt(e.target.value))}
            />
          </label>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Target</span>
            </div>
            <select
              name={"dest-network"}
              className="select select-bordered"
              value={selectedNetwork} // ...force the select's value to match the state variable...
              onChange={e => {
                console.error(e.target.value);
                setSelectedNetwork(e.target.value);
              }}
            >
              <option disabled key={""}>
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
              Bridge
            </button>
            <div className="stats">
              <div className="stat">
                <ul className="list-disc">
                  <li className="label-text-alt text-left">Sends to you on target network</li>
                  <li className="label-text-alt text-left">
                    If targeting the original network, then unlocks the original NFT
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

export default Bridge;
