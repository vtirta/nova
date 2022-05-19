import {LCDClient, MsgExecuteContract, Fee} from "@terra-money/terra.js";
import {contractAddress} from "./address";
import {generateCode} from "../utils/helpers";

// ==== utils ====

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const until = Date.now() + 1000 * 60 * 60;
const untilInterval = Date.now() + 1000 * 60;

const _exec =
    (msgs, fee = new Fee(300000, {uluna: 10000})) =>
        async (wallet) => {
            const lcd = new LCDClient({
                URL: wallet.network.lcd,
                chainID: wallet.network.chainID,
            });

            console.log("msgs", msgs);

            const contractMsgs = [];

            const count = msgs.length;
            console.log("count", count);

            for (let i = 0; i < count; i++) {
                console.log("I", i);
                contractMsgs.push(
                    new MsgExecuteContract(
                        wallet.walletAddress,
                        contractAddress(wallet),
                        msgs[i]
                    )
                )
            }

            fee = new Fee(200000 * contractMsgs.length, {uluna: 10000 * contractMsgs.length});

            console.log("MSGSSSSS", msgs);

            const {result} = await wallet.post({
                fee,
                msgs: contractMsgs
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

export const mint = async (wallet, owner_address, nft_name, image_url, payment, maturity, total_bonds) => {

    const msgs = [];

    const id = generateCode(10);
    const issue_date = ""+Date.now();

    for (let i = 0; i < total_bonds; i++) {
        const token_id = id + ":" + i;
        msgs.push(
            {
                mint: {
                    token_id: token_id,
                    owner: owner_address,
                    extension: {
                        name: nft_name,
                        image: image_url,
                        description: `Sentient bond for ${nft_name}`,
                        animation_url: "https://assets3.lottiefiles.com/packages/lf20_zinxs4wn.json",
                        attributes: [
                            {
                                "trait_type": "token_id",
                                "value": token_id
                            },
                            {
                                "trait_type": "issued_date",
                                "value": issue_date
                            },
                            {
                                "trait_type": "payment",
                                "value": "" + payment
                            },
                            {
                                "trait_type": "maturity_in_months",
                                "value": "" + maturity
                            },
                            {
                                "trait_type": "total_bonds",
                                "value": "" + total_bonds
                            },
                        ]
                    },
                }
            }
        )
    }

    return _exec(msgs)(wallet)
};
