import { createContext } from 'react';
import {Coins} from "@terra-money/terra.js";

interface IBankContext {
    bank: Coins|null;
    refreshBalance: () => void;
}

const defaultState = {
    bank: null,
    refreshBalance: () => { throw Error("function must be implemented")},
}

const BankContext = createContext<IBankContext>(defaultState);
export default BankContext;
