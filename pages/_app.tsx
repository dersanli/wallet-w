import '../styles/globals.css'
import type {AppProps} from 'next/app'
import {WalletProvider, CHAIN_TYPES} from "../components/WalletContext";


const MyApp = ({Component, pageProps}: AppProps) =>
    <WalletProvider chainType={CHAIN_TYPES.mumbai}>
        <Component {...pageProps} />
    </WalletProvider>


export default MyApp
