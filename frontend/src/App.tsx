import React, {useEffect, useState} from 'react';
import {
    Box,
    Container,
    FormControl,
    FormLabel,
    Grid, InputAdornment,
    Slider,
    TextField,
    ToggleButton,
    ToggleButtonGroup
} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import moment from 'moment';

import NavBar from './components/NavBar';
// import {ConnectSample} from './components/ConnectSample';
// import {CW20TokensSample} from './components/CW20TokensSample';
// import {NetworkSample} from './components/NetworkSample';
// import {QuerySample} from './components/QuerySample';
// import {SignBytesSample} from './components/SignBytesSample';
// import {SignSample} from './components/SignSample';
// import {TxSample} from './components/TxSample';
// import WalletHoldingsWidget from "./components/WalletHoldingsWidget";
import BankContext from './components/Bank';
import {useConnectedWallet, useLCDClient} from '@terra-money/wallet-provider';
import {ConnectedWallet} from "@terra-money/use-wallet";
import {Coins} from "@terra-money/terra.js";

import {ThemeProvider, createTheme} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './App.css';


const fonts = [
    'Open Sans',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
];

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#08a4ff',
        },
        secondary: {
            main: '#003FFF',
        },
        background: {
            default: "#000748"
        },
    },
    typography: {
        // In Chinese and Japanese the characters are usually larger,
        // so a smaller fontsize may be appropriate.
        fontFamily: fonts.join(','),
        button: {
            fontFamily: fonts.join(','),
            textTransform: 'none'
        },
        fontSize: 14,
    },
});

function App() {
    const connectedWallet = useConnectedWallet();
    const lcd = useLCDClient();
    const [wallet, setWallet] = useState<ConnectedWallet | undefined>(undefined);
    const [bank, setBank] = useState<Coins | null>(null);

    const [name, setName] = useState(`BOND`);
    const [expiration, setExpiration] = useState(6);
    const [monthlyPayment, setMonthlyPayment] = useState(1000);
    const [numOfBonds, setNumOfBonds] = useState(50);

    const refreshBalance = () => {
        if (connectedWallet) {
            lcd.bank.balance(connectedWallet.walletAddress).then(([coins]) => {
                setBank(coins);
            });
        }
    }

    useEffect(() => {
        // setWallet(connectedWallet);
        if (connectedWallet) {
            setName(`BOND ${connectedWallet.walletAddress.slice(5, 15).toUpperCase()}`)
            lcd.bank.balance(connectedWallet.walletAddress).then(([coins]) => {
                setBank(coins);
            });
        } else {
            setBank(null);
        }
    }, [connectedWallet, lcd]);

    const handleExpirationChange = (
        event: React.MouseEvent<HTMLElement>,
        newExpiration: number,
    ) => {
        setExpiration(newExpiration);
    };

    const handleNumOfBondsChange = (event: Event, newValue: number | number[]) => {
        setNumOfBonds(newValue as number);
    };

    return (
        <BankContext.Provider value={{bank, refreshBalance}}>
            <ThemeProvider theme={darkTheme}>
                <CssBaseline/>

                <NavBar/>

                <Container sx={{flexGrow: 1}} style={{marginTop: 50}}>
                    <h1>Create / Mint Bond</h1>

                    <Box>
                        <label htmlFor="name">Name
                            <TextField id="name" variant="outlined" fullWidth margin="normal"
                                       value={name}
                                       onChange={(e) => setName(e.target.value)}
                                       InputLabelProps={{
                                           style: {fontSize: 20},
                                       }}
                                       InputProps={{
                                           style: {fontSize: 20},
                                       }}/>
                        </label>
                        <Grid container spacing={2}>
                            <Grid item md={3}>
                                <label htmlFor="monthlyPayment">Collateral / Payment
                                    <TextField id="monthlyPayment" variant="outlined"
                                               margin="normal"
                                               type="currency"
                                               value={monthlyPayment}
                                               onChange={(e) => {
                                                   const amt = +e.target.value;
                                                   if (isNaN(amt) || amt < 1) {
                                                       setMonthlyPayment(1);
                                                   } else {
                                                       setMonthlyPayment(+e.target.value);
                                                   }
                                               }}
                                               InputLabelProps={{
                                                   style: {fontSize: 20},
                                               }}
                                               InputProps={{
                                                   style: {fontSize: 20},
                                                   startAdornment: <InputAdornment position="start"><span
                                                       style={{fontSize: 20}}>$</span></InputAdornment>,
                                                   endAdornment: <InputAdornment position="end"><span
                                                       style={{fontSize: 20}}>per month</span></InputAdornment>,
                                               }}
                                    />
                                </label>
                            </Grid>

                            <Grid item md={6}>
                                <FormControl>
                                    <FormLabel sx={{color: '#fff', marginBottom: 2}}>Expiration</FormLabel>
                                    <ToggleButtonGroup
                                        color="primary"
                                        value={expiration}
                                        exclusive
                                        onChange={handleExpirationChange}
                                    >
                                        {
                                            [3, 6, 9, 12].map((m) => (
                                                <ToggleButton value={m} style={{fontSize: 20}}>{m} months</ToggleButton>
                                            ))
                                        }
                                    </ToggleButtonGroup>
                                </FormControl>
                            </Grid>

                            <Grid item md={2}>
                                <label htmlFor="maturityDate">Maturity Date
                                    <TextField id="maturityDate" variant="outlined"
                                               margin="normal"
                                               type="currency"
                                               value={(moment()).add(expiration, 'M').format('DD MMM YYYY')}
                                               InputProps={{
                                                   readOnly: true,
                                                   style: {fontSize: 20},
                                               }}
                                    />
                                </label>
                            </Grid>

                            <Grid item md={8}>
                                <Box width="800" sx={{paddingRight: 5}}>
                                    <FormLabel sx={{color: '#fff', marginBottom: 2}}>Number of Bonds</FormLabel>
                                    <Slider
                                        aria-label="Number of Bonds"
                                        defaultValue={numOfBonds}
                                        onChange={handleNumOfBondsChange}
                                        valueLabelDisplay="on"
                                        step={5}
                                        marks
                                        min={5}
                                        max={100}
                                    />
                                </Box>
                            </Grid>
                            <Grid item md={4}>
                                <TextField id="pricePerBond" variant="outlined" margin="normal"
                                           value={(expiration * monthlyPayment / numOfBonds).toFixed(0)}
                                           InputProps={{
                                               readOnly: true,
                                               style: {fontSize: 30},
                                               startAdornment: <InputAdornment position="start"><span
                                                   style={{fontSize: 30}}>$</span></InputAdornment>,
                                               endAdornment: <InputAdornment position="end"><span
                                                   style={{fontSize: 20}}>Price per Bond</span></InputAdornment>,
                                           }}/>
                            </Grid>
                        </Grid>

                        <Box sx={{marginTop: 4}}>
                            <label htmlFor="total" style={{fontSize: 40}}>TOTAL: ${expiration * monthlyPayment}</label>
                            {/*<TextField id="total" variant="outlined"*/}
                            {/*           margin="normal"*/}
                            {/*           type="currency"*/}
                            {/*           value={expiration * monthlyPayment}*/}
                            {/*           InputLabelProps={{*/}
                            {/*               style: {fontSize: 40, fontWeight: 'bold'},*/}
                            {/*           }}*/}
                            {/*           InputProps={{*/}
                            {/*               readOnly: true,*/}
                            {/*               style: {fontSize: 40},*/}
                            {/*               startAdornment: <InputAdornment position="start"><span*/}
                            {/*                   style={{fontSize: 40}}>$</span></InputAdornment>,*/}
                            {/*               // endAdornment: <InputAdornment position="end"><span*/}
                            {/*               //     style={{fontSize: 20}}>TOTAL</span></InputAdornment>,*/}
                            {/*           }}*/}
                            {/*/>*/}
                        </Box>
                    </Box>
                    <Box sx={{marginTop: 4}}>
                        <LoadingButton variant="contained" size="large"
                                       sx={{color: "#FFF", fontSize: 24}}>Mint
                            Bond</LoadingButton>
                    </Box>
                </Container>

                {/*<ConnectSample/>*/}
                {/*<QuerySample/>*/}
                {/*<TxSample/>*/}
                {/*<SignSample/>*/}
                {/*<SignBytesSample/>*/}
                {/*<CW20TokensSample/>*/}
                {/*<NetworkSample/>*/}
            </ThemeProvider>
        </BankContext.Provider>
    );
}

export default App;
