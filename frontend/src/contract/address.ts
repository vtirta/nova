// sync-ed from root via `tr sync-refs`
import { ConnectedWallet } from "@terra-money/use-wallet";

  // @ts-ignore
import config from "../refs.terrain.json";
export const contractAddress = (wallet: ConnectedWallet, contract: string) => {
  // Make sure the contract has actually been deployed to selected network.
  // @ts-ignore
  if (config[wallet.network.name][contract].contractAddresses?.default) {
    // @ts-ignore
    return config[wallet.network.name][contract].contractAddresses?.default;
  }

  alert(`Contract not deployed on currently selected network: ${wallet.network.name}\n\nSelect the correct network in your wallet!`);
}
