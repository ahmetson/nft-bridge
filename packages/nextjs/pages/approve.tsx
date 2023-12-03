import { useEffect } from "react";
import type { NextPage } from "next";
import { useLocalStorage } from "usehooks-ts";
import { MetaHeader } from "~~/components/MetaHeader";
import { ContractName } from "~~/utils/scaffold-eth/contract";
import { getContractNames } from "~~/utils/scaffold-eth/contractNames";

const selectedContractStorageKey = "scaffoldEth2.selectedContract";
const contractNames = getContractNames();

const Approve: NextPage = () => {
  const [selectedContract, setSelectedContract] = useLocalStorage<ContractName>(
    selectedContractStorageKey,
    contractNames[0],
  );

  useEffect(() => {
    if (!contractNames.includes(selectedContract)) {
      setSelectedContract(contractNames[0]);
    }
  }, [selectedContract, setSelectedContract]);

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
            <input type="text" placeholder="0x..." className="input input-bordered w-full max-w-xs" />
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
            <button className="btn btn-primary">Approve</button>
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
