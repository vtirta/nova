import React, {useEffect, useState} from 'react';
import {Coins} from "@terra-money/terra.js";
import {useConnectedWallet, useLCDClient} from '@terra-money/wallet-provider';

import WalletHoldings from "./WalletHoldings";
import {Card, CardContent} from "@mui/material";

const WalletHoldingsWidget = () => {
    const connectedWallet = useConnectedWallet();
    const lcd = useLCDClient();
    const [bank, setBank] = useState<Coins | null>(null);
    useEffect(() => {
        if (connectedWallet) {
            lcd.bank.balance(connectedWallet.walletAddress).then(([coins]) => {
                setBank(coins);
            });
        } else {
            setBank(null);
        }
    }, [connectedWallet, lcd]);
    return (
        <Card sx={{minWidth: 200, maxWidth: 400}}>
            <CardContent>
                <WalletHoldings bank={bank}/>
            </CardContent>
        </Card>
    )
}

export default WalletHoldingsWidget;
