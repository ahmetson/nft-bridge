import Link from "next/link";
import type { NextPage } from "next";
import { BuildingStorefrontIcon, FaceSmileIcon, GlobeAltIcon, LockOpenIcon } from "@heroicons/react/24/outline";
import { MetaHeader } from "~~/components/MetaHeader";

const Home: NextPage = () => {
  return (
    <>
      <MetaHeader />
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center mb-8">
            <span className="block text-4xl font-bold">NFT Bridge</span>
            <span className="block text-2xl mb-2">
              Powered by <Link href={"https://chain.link/cross-chain"}>Chainlink CCIP</Link>
            </span>
          </h1>
          <p className="text-center text-lg">
            An <strong className="text-bold">NFT Bridge</strong>, that is:
          </p>
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <LockOpenIcon className="h-8 w-8 fill-secondary" />
              <p>Anyone can bridge NFTs, because we are permission-less.</p>
            </div>
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <BuildingStorefrontIcon className="h-8 w-8 fill-secondary" />
              <p>No code, no setup to make the NFT cross-chain.</p>
            </div>
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <GlobeAltIcon className="h-8 w-8 fill-secondary" />
              <p>A built in UI dashboard</p>
            </div>
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <FaceSmileIcon className="h-8 w-8 fill-secondary" />
              <p>No fee, its for free</p>
            </div>
          </div>
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            <div className="flex flex-col px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <p>Are you a Project Owner?</p>
              <Link href="/register" className="btn btn-secondary">
                Register
              </Link>
            </div>
            <div className="flex flex-col px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <p>Are you an NFT Owner?</p>
              <Link href="/bridge" className="btn btn-primary">
                Bridge
              </Link>
            </div>
          </div>
        </div>

        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            <div className="flex flex-col px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <h4>Watch the showcase</h4>
              <div className=" aspect-video ">
                <iframe
                  width="560"
                  height="315"
                  src="https://www.youtube.com/embed/HTLVvPv4gSA?si=-TC0dZLGHrAG0c9p"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                ></iframe>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-grow bg-base-200 w-full px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            <div className="flex flex-col px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <p>
                The code is{" "}
                <Link
                  className="italic bg-base-300 font-bold max-w-full ml-1"
                  href={"https://github.com/ahmetson/nft-bridge"}
                >
                  Open Source
                </Link>
              </p>
              <p>
                Made for the{" "}
                <Link
                  className="italic bg-base-300 font-bold max-w-full ml-1"
                  href={"https://devpost.com/software/nft-bridge"}
                >
                  Chainlink Hackathon
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
