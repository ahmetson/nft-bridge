import React, { useEffect, useState } from "react";
import { Abi } from "abitype";
import type { NextPage } from "next";
import { useAccount, useNetwork } from "wagmi";
import { readContract, waitForTransaction, writeContract } from "wagmi/actions";
import { MetaHeader } from "~~/components/MetaHeader";
import { Spinner } from "~~/components/assets/Spinner";
import { TxnNotification, useDeployedContractInfo } from "~~/hooks/scaffold-eth";
import WrapperNft from "~~/utils/WrappedNft";
import { getTargetById, notification } from "~~/utils/scaffold-eth";
import { ContractName } from "~~/utils/scaffold-eth/contract";

const managerNames = ["Registrar", "LinkedFactory"] as Array<ContractName>;

const Approve: NextPage = () => {
  const { chain } = useNetwork();
  const { address, isConnecting, isDisconnected } = useAccount();

  const configuredNetwork = getTargetById(chain?.id as number);
  const { data: registrarData, isLoading: isRegistrarLoading } = useDeployedContractInfo(
    managerNames[0],
    chain?.id as number,
  );
  const [originalNft, setOriginalNft] = useState("");

  useEffect(() => {
    console.log(`registrar`, registrarData);
  }, [registrarData, isRegistrarLoading]);

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
        {`No contract found by the name of "${managerNames[0]}" on chain "${configuredNetwork.name}"!`}
      </p>
    );
  }

  async function onClick() {
    let notificationId = notification.loading(<TxnNotification message="Checking the Wrapper" />);

    // first checking in the Registrar. If wrapper exists, we say you can set up.
    const wrapperAddress = await readContract({
      address: registrarData?.address as string,
      abi: registrarData?.abi as Abi,
      functionName: "linkedAddrs",
      args: [originalNft],
    });
    notification.remove(notificationId);
    if (wrapperAddress === "0x0000000000000000000000000000000000000000") {
      notification.error(
        <TxnNotification message={`NFT is not bridged or it's a wrong network, contact to the NFT creator`} />,
      );
      return;
    }

    // Let's see that NFT is owned by the user.
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
    if (approvedForAll) {
      notification.success(<TxnNotification message={`NFT already approved`} />);
      return;
    }

    notificationId = notification.loading(<TxnNotification message="Approve the Wrapper to use NFT" />);

    let hash: `0x${string}`;

    try {
      const { hash: signedHash } = await writeContract({
        address: originalNft,
        abi: WrapperNft as Abi,
        functionName: "setApprovalForAll",
        args: [wrapperAddress, true],
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
        blockExplorerLink={configuredNetwork.blockExplorers?.default.url + "/tx/" + hash}
      />,
    );

    await waitForTransaction({
      hash,
    });
    notification.remove(notificationId);

    notification.success(
      <TxnNotification
        message={`Wrapper NFT address approved, you can bridge now`}
        blockExplorerLink={`${configuredNetwork.blockExplorers?.default.url}/token/${wrapperAddress}`}
      />,
    );
  }

  return (
    <>
      <MetaHeader title="Asking your approval to bridge | NFT Bridge" description="Need to approve your NFT" />
      <div className="flex justify-center items-center gap-12 flex-col sm:flex-row mt-20">
        <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
          <h1>Approve</h1>
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
                  <li className="label-text-alt text-left">Wallets may warn that its dangerous. Simply ignore it.</li>
                </ul>
              </div>
            </div>
          </label>
          <label className="form-control w-full max-w-xs">
            <div className="label divider">COMPLETE</div>
            <button className="btn btn-primary" onClick={() => onClick()}>
              Approve
            </button>
            <div className="stats">
              <div className="stat">
                <ul className="list-disc">
                  <li className="label-text-alt text-left">Approves for all NFTs, so call only once</li>
                </ul>
              </div>
            </div>
          </label>
        </div>
      </div>
    </>
  );
};

export default Approve;
