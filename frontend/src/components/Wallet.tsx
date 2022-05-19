import { createContext } from 'react';
import { ConnectedWallet } from '@terra-money/wallet-types';
import {Coins} from "@terra-money/terra.js";

export interface Wallet {
    connectedWallet: ConnectedWallet|undefined;
    bank: Coins|undefined;
}

const WalletContext = createContext<ConnectedWallet|undefined>(undefined);
export default WalletContext;
