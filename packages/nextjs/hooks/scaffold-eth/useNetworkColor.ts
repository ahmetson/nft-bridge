import { useDarkMode } from "usehooks-ts";
import { getTargetNetworks } from "~~/utils/scaffold-eth";

const DEFAULT_NETWORK_COLOR: [string, string] = ["#666666", "#bbbbbb"];

/**
 * Gets the color of the target network
 */
export const useNetworkColor = () => {
  const { isDarkMode } = useDarkMode();
  const colorConfig = getTargetNetworks()[0].color ?? DEFAULT_NETWORK_COLOR;

  return Array.isArray(colorConfig) ? (isDarkMode ? colorConfig[1] : colorConfig[0]) : colorConfig;
};
