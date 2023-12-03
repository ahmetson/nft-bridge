import React from "react";
import Link from "next/link";
import { CurrencyDollarIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { HeartIcon } from "@heroicons/react/24/outline";
import { SwitchTheme } from "~~/components/SwitchTheme";
import { AhmetsonLogo } from "~~/components/assets/AhmetsonLogo";
import { Faucet } from "~~/components/scaffold-eth";
import { useGlobalState } from "~~/services/store/store";

/**
 * Site footer
 */
export const Footer = () => {
  const nativeCurrencyPrice = useGlobalState(state => state.nativeCurrencyPrice);
  const isLocalNetwork = false;

  return (
    <div className="min-h-0 py-5 px-1 mb-11 lg:mb-0">
      <div>
        <div className="fixed flex justify-between items-center w-full z-10 p-4 bottom-0 left-0 pointer-events-none">
          <div className="flex flex-col md:flex-row gap-2 pointer-events-auto">
            {nativeCurrencyPrice > 0 && (
              <div>
                <div className="btn btn-primary btn-sm font-normal normal-case gap-1 cursor-auto">
                  <CurrencyDollarIcon className="h-4 w-4" />
                  <span>{nativeCurrencyPrice}</span>
                </div>
              </div>
            )}
            {isLocalNetwork && (
              <>
                <Faucet />
                <Link href="/blockexplorer" passHref className="btn btn-primary btn-sm font-normal normal-case gap-1">
                  <MagnifyingGlassIcon className="h-4 w-4" />
                  <span>Block Explorer</span>
                </Link>
              </>
            )}
          </div>
          <SwitchTheme className={`pointer-events-auto ${isLocalNetwork ? "self-end md:self-auto" : ""}`} />
        </div>
      </div>
      <div className="w-full">
        <ul className="menu menu-horizontal w-full">
          <div className="flex justify-center items-center gap-2 text-sm w-full">
            <div className="text-center">
              <a href="https://github.com/scaffold-eth/se-2" target="_blank" rel="noreferrer" className="link">
                Fork me
              </a>
            </div>
            <span>·</span>
            <div className="flex justify-center items-center gap-2">
              <p className="m-0 text-center">
                Delivered with <HeartIcon className="inline-block h-4 w-4" /> by
              </p>
              <a
                className="flex justify-center items-center gap-1"
                href="https://github.com/ahmetson"
                target="_blank"
                rel="noreferrer"
              >
                <AhmetsonLogo className="w-3 h-5 pb-1" />
                <span className="link">Medet Ahmetson</span>
              </a>
            </div>
            <span>·</span>
            <div className="text-center">
              <a href="https://www.linkedin.com/in/ahmetson/" target="_blank" rel="noreferrer" className="link">
                Support
              </a>
            </div>
            <span>·</span>
            <div className="text-center">
              <a href="https://github.com/ahmetson/nft-bridge" target="_blank" rel="noreferrer" className="link">
                Source Code
              </a>
            </div>
          </div>
        </ul>
      </div>
    </div>
  );
};
