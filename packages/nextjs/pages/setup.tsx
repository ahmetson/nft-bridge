import { useEffect } from "react";
import Link from "next/link";
import type { NextPage } from "next";
import { useLocalStorage } from "usehooks-ts";
import { MetaHeader } from "~~/components/MetaHeader";
import { ContractName } from "~~/utils/scaffold-eth/contract";
import { getContractNames } from "~~/utils/scaffold-eth/contractNames";

const selectedContractStorageKey = "scaffoldEth2.selectedContract";
const contractNames = getContractNames(11155111);

const Setup: NextPage = () => {
  const [selectedContract, setSelectedContract] = useLocalStorage<ContractName>(
    selectedContractStorageKey,
    contractNames[0],
  );

  useEffect(() => {
    if (!contractNames.includes(selectedContract as string)) {
      setSelectedContract(contractNames[0]);
    }
  }, [selectedContract, setSelectedContract]);

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
            <input type="text" placeholder="0x..." className="input input-bordered w-full max-w-xs" />
            <div className="stats">
              <div className="stat">
                <ul className="list-disc">
                  <li className="label-text-alt text-left">
                    NFT Must be{" "}
                    <Link href={"/register"} className={"bold bg-base-300"}>
                      Registered
                    </Link>
                  </li>
                  <li className="label-text-alt text-left">:) Supports cross-chain, simply setup repeatedly</li>
                </ul>
              </div>
            </div>
          </label>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Target</span>
            </div>
            <select className="select select-bordered">
              <option disabled selected>
                Select a network
              </option>
              <option>Sepolia</option>
              <option>Avalanche Fuji</option>
              <option>BNB Chain Testnet</option>
              <option>Polygon Mumbai</option>
            </select>
          </label>
          <label className="form-control w-full max-w-xs">
            <div className="label divider">COMPLETE</div>
            <button className="btn btn-primary">Setup</button>
            <div className="stats">
              <div className="stat">
                <ul className="list-disc">
                  <li className="label-text-alt text-left">
                    Setup creates a linked NFT on a target blockchain linked to all other Linked NFTs and Wrapped NFT.
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
