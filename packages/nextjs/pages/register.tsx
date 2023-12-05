import React, { useEffect, useState } from "react";
import { Abi } from "abitype";
import type { NextPage } from "next";
import { parseEther } from "viem";
import { useAccount, useNetwork } from "wagmi";
import { readContract, waitForTransaction, writeContract } from "wagmi/actions";
import { MetaHeader } from "~~/components/MetaHeader";
import { Spinner } from "~~/components/assets/Spinner";
import { TxnNotification, useDeployedContractInfo } from "~~/hooks/scaffold-eth";
import { getTargetById, notification } from "~~/utils/scaffold-eth";
import { ContractName } from "~~/utils/scaffold-eth/contract";

const managerNames = ["Registrar", "LinkedFactory"] as Array<ContractName>;

const Register: NextPage = () => {
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
    const existingWrapper = await readContract({
      address: registrarData?.address as string,
      abi: registrarData?.abi as Abi,
      functionName: "linkedAddrs",
      args: [originalNft],
    });
    notification.remove(notificationId);
    if (existingWrapper !== "0x0000000000000000000000000000000000000000") {
      notification.error(<TxnNotification message={`NFT wrapped. You can setup`} />);
      return;
    }

    // Let's see that NFT is owned by the user.
    let owner = "";
    notificationId = notification.loading(<TxnNotification message="Validating NFT ownership" />);
    try {
      const res = await readContract({
        address: originalNft,
        abi: registrarData?.abi as Abi, // the registrar is ownable.
        functionName: "owner",
        args: [],
      });
      owner = res as string;
    } catch (error: any) {
      notification.remove(notificationId);
      notification.error(<TxnNotification message={`Failed to fetch nft admin: ${error}`} />);
      return;
    }
    notification.remove(notificationId);
    if (owner?.toLowerCase() !== address?.toLowerCase()) {
      notification.error(<TxnNotification message={`You are not the owner of the NFT`} />);
      return;
    }

    notificationId = notification.loading(<TxnNotification message="Sign the transaction" />);

    let hash: `0x${string}`;

    try {
      const { hash: signedHash } = await writeContract({
        address: registrarData?.address as string,
        abi: registrarData?.abi as Abi,
        functionName: "register",
        args: [originalNft, "0x0000000000000000000000000000000000000000000000000000000000000000"],
        value: parseEther("0"), // paying if deployTx argument provided
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
        blockExplorerLink={configuredNetwork.blockExplorers?.default + hash}
      />,
    );

    await waitForTransaction({
      hash,
    });
    notification.remove(notificationId);

    // get the wrapper address
    const wrapperAddress = await readContract({
      address: registrarData?.address as string,
      abi: registrarData?.abi as Abi,
      functionName: "linkedAddrs",
      args: [originalNft],
    });

    notification.success(
      <TxnNotification
        message={`Smartcontract registered, the Wrapper NFT address: ${wrapperAddress}`}
        blockExplorerLink={`${configuredNetwork.blockExplorers?.default.url}/token/${wrapperAddress}`}
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
          <h1>Register</h1>
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
                  <li className="label-text-alt text-left">Only smartcontract owner can call it.</li>
                  <li className="label-text-alt text-left">
                    NFT must be deployed and not bridged with NFT Bridge before.
                  </li>
                  <li className="label-text-alt text-left">Its free! :)</li>
                </ul>
              </div>
            </div>
          </label>
          <label className="form-control w-full max-w-xs">
            <div className="label divider">COMPLETE</div>
            <button className="btn btn-primary" onClick={() => onClick()}>
              Register
            </button>
            <div className="stats">
              <div className="stat">
                <ul className="list-disc">
                  <li className="label-text-alt text-left">Creates a Wrapper thats linked to all other NFTs.</li>
                </ul>
              </div>
            </div>
          </label>
        </div>
      </div>
    </>
  );
};

export default Register;
