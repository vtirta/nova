import React, {useContext, useRef, useState} from 'react';
import {useConnectedWallet, useWallet, WalletStatus} from '@terra-money/wallet-provider';

import {
    ButtonGroup,
    Button,
    Fab,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Popover,
    Box
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

import './ConnectWallet.css';
import StationIcon from '../img/station.svg';
import TerraIcon from '../img/terra-logo-only-small.svg';
import WalletConnectIcon from '../img/wallet-connect-icon.svg';
import GenericWalletIcon from '../img/generic-wallet.svg';
import WalletHoldings from "./WalletHoldings";
import BankContext from "./Bank";

const formatWalletAddress = (s: string) => {
    return s.slice(5, 9) + '...' + s.slice(40);
}

const ConnectedWalletButton = () => {
    const {
        disconnect,
    } = useWallet();
    const connectedWallet = useConnectedWallet();
    const {bank,} = useContext(BankContext);

    const inputEl = useRef(null);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <ButtonGroup ref={inputEl} className="connected-wallet-btn" variant="contained" style={{borderRadius: 50}}
                         color="primary"
                         aria-label="Wallet">
                <Button onClick={handleClick}>
                    <img src={TerraIcon} width={25} alt={'Terra icon'} style={{marginRight: 8}}/>
                    {connectedWallet?.walletAddress ? formatWalletAddress(connectedWallet.walletAddress) : ''}
                </Button>
                <Button onClick={handleClick}>
                    <span style={{marginRight: 10}}>UST</span>
                    <span>{bank?.get("uusd")?.amount.dividedBy(1000000).toFixed(2) || "0.00"}</span>
                </Button>
            </ButtonGroup>
            <Popover
                id="connected-wallet-menu"
                open={open}
                anchorEl={inputEl.current}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <Box textAlign='center'
                     sx={{minWidth: 400, paddingTop: 0, paddingLeft: 2, paddingRight: 2, paddingBottom: 2}}>
                    <WalletHoldings bank={bank}/>
                    <Button variant="contained" size="medium" color="primary" aria-label="add" sx={{marginTop: 2}}
                            onClick={() => disconnect()}>Disconnect</Button>
                </Box>
            </Popover>
        </>
    )
}

const ConnectWallet = () => {

    const {
        status,
        availableConnectTypes,
        availableInstallTypes,
        // availableConnections,
        connect,
        install,
    } = useWallet();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const formatWalletName = (connectType: string) => {
        switch (connectType) {
            case 'EXTENSION':
                return "Terra Station Wallet";
            case 'WALLETCONNECT':
                return "Wallet Connect";
            default:
                return 'Unknown connect type';
        }
    }

    const walletIcon = (connectType: string) => {
        switch (connectType) {
            case 'EXTENSION':
                return StationIcon;
            case 'WALLETCONNECT':
                return WalletConnectIcon;
            default:
                return GenericWalletIcon;
        }
    }

    return (
        <div>
            {status === WalletStatus.WALLET_NOT_CONNECTED && (
                <Fab variant="extended" size="medium" color="secondary" aria-label="add" onClick={handleClick}>
                    <AccountBalanceWalletIcon sx={{mr: 1}}/>
                    Connect wallet
                </Fab>
            )}
            {status !== WalletStatus.WALLET_NOT_CONNECTED && (
                <ConnectedWalletButton/>
            )}
            <Menu
                id="wallet-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                {availableInstallTypes.map((connectType) => (
                    <MenuItem key={'install-' + connectType} onClick={() => install(connectType)}>
                        <ListItemIcon>
                            <img src={walletIcon(connectType)} alt="Terra Station Wallet Icon" width={25}/>
                        </ListItemIcon>
                        <ListItemText>Install {formatWalletName(connectType)}</ListItemText>
                    </MenuItem>
                ))}
                {availableConnectTypes.filter((connectType) => connectType !== 'READONLY').map((connectType) => (
                    <MenuItem key={'connect-' + connectType} onClick={() => {
                        connect(connectType);
                        setAnchorEl(null);
                    }}>
                        <ListItemIcon>
                            <img src={walletIcon(connectType)} alt="Terra Station Wallet Icon" width={25}/>
                        </ListItemIcon>
                        <ListItemText>{formatWalletName(connectType)}</ListItemText>
                    </MenuItem>
                ))}
                {/*{availableConnections.map(*/}
                {/*    ({type, name, icon, identifier = ''}) => (*/}
                {/*        <MenuItem key={'connection-' + type + identifier} onClick={() => {*/}
                {/*            connect(type, identifier);*/}
                {/*            setAnchorEl(null);*/}
                {/*        }}>*/}
                {/*            <ListItemIcon>*/}
                {/*                <img*/}
                {/*                    src={icon}*/}
                {/*                    alt={name}*/}
                {/*                    style={{width: '1em', height: '1em'}}*/}
                {/*                />*/}
                {/*            </ListItemIcon>*/}
                {/*            <ListItemText>{name} [{identifier}]</ListItemText>*/}
                {/*        </MenuItem>*/}
                {/*    ),*/}
                {/*)}*/}
            </Menu>
        </div>
    )
}

export default ConnectWallet;
