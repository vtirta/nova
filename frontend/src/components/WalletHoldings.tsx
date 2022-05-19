import React from 'react';
import {Coins, Coin,} from "@terra-money/terra.js";
import {TableContainer, Table, TableBody, TableRow, TableCell} from '@mui/material';

import TerraLunaIcon from '../img/terra-luna-luna-logo.svg';
import TerraUstIcon from '../img/terra-ust-logo.png';

const formatCoinName = (coin: Coin) => {
    switch (coin.denom) {
        case "uusd":
            return "UST";
        case "uluna":
            return "LUNA";
        default:
            return coin.denom;
    }
}

const coinLogo = (coin: Coin) => {
    switch (coin.denom) {
        case "uusd":
            return TerraUstIcon;
        case "uluna":
            return TerraLunaIcon;
        default:
            return undefined;
    }
}

type WalletProps = {
    bank: Coins | null;
}

const WalletHoldings = ({bank}: WalletProps) => {

    return (
        <>
            <h2 style={{fontSize: 16}}>My Wallet</h2>
            {
                bank &&
                <TableContainer>
                    <Table sx={{minWidth: 200}} aria-label="simple table">
                        <TableBody>
                            {bank && bank.map((coin: Coin) => (
                                <TableRow
                                    key={coin.denom}
                                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                >
                                    <TableCell component="th" scope="row">
                                        <img src={coinLogo(coin)} width={20} style={{marginRight: 10}} alt="Coin icon"/>
                                        {formatCoinName(coin)}
                                    </TableCell>
                                    <TableCell
                                        align="right">{coin?.amount?.dividedBy(1000000).toFixed(2) || "0.00"}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            }
            {!bank &&
                <p>Please connect wallet to start.</p>
            }
        </>
    )
}

export default WalletHoldings;
