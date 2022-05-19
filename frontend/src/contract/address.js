// sync-ed from root via `tr sync-refs`
import config from "../refs.terrain.json"
export const contractAddress = (wallet) => {
    // console.log('wallet', wallet)
    const address = config[wallet.network.name]['cw721-metadata-onchain'].contractAddresses.default;
    // console.log('address', address);
    return address;
}
