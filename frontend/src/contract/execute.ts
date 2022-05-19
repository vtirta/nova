import {ConnectedWallet} from "@terra-money/use-wallet";
import {LCDClient, MsgExecuteContract, Fee, Coins} from "@terra-money/terra.js";
import {contractAddress} from "./address";

// ==== utils ====

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const until = Date.now() + 1000 * 60 * 60;
const untilInterval = Date.now() + 1000 * 60;

const _exec = (contract: string, msg: any, coinAmount?: number, fee = new Fee(1000000, {uusd: 200000})) =>
    async (wallet: ConnectedWallet) => {
        const lcd = new LCDClient({
            URL: wallet.network.lcd,
            chainID: wallet.network.chainID,
        });
        console.log('msg', msg)
        // console.log('contract', contract)
        const amtInMicroUnit = coinAmount ? parseFloat((coinAmount * 1000000).toFixed(4)) : 0;
        console.log('amtInMicroUnit', amtInMicroUnit);
        let coins = coinAmount ? new Coins({uusd: amtInMicroUnit}) : undefined;

        const {result} = await wallet.post({
            fee,
            msgs: [
                new MsgExecuteContract(
                    wallet.walletAddress,
                    contractAddress(wallet, contract),
                    msg,
                    coins,
                ),
            ],
        });

        while (true) {
            try {
                return await lcd.tx.txInfo(result.txhash);
            } catch (e) {
                if (Date.now() < untilInterval) {
                    await sleep(500);
                } else if (Date.now() < until) {
                    await sleep(1000 * 10);
                } else {
                    throw new Error(
                        `Transaction queued. To verify the status, please check the transaction hash: ${result.txhash}`
                    );
                }
            }
        }
    };

// ==== execute contract ====

export const dispense = async (wallet: ConnectedWallet, code: string, amount: number) =>
    _exec("caja", {dispense: {code}}, amount)(wallet);

export const redeem = async (wallet: ConnectedWallet, code: string) =>
    _exec("caja", {redeem: {code}})(wallet);

