import { ConnectedWallet } from "@terra-money/use-wallet";
import { LCDClient } from '@terra-money/terra.js'
import { contractAddress } from './address'

export const getCount = async (wallet: ConnectedWallet) => {
  const lcd = new LCDClient({
    URL: wallet.network.lcd,
    chainID: wallet.network.chainID,
  })
  return lcd.wasm.contractQuery(contractAddress(wallet, "caja"), { get_count: {} })
}
