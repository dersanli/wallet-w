import {CHAIN_NAMESPACES, WALLET_ADAPTER_TYPE} from '@web3auth/base';
import WalletProvider, {WalletContext} from "./Web3AuthWalletContext";
// import WalletProvider, {WalletContext} from "./Web3AuthCoreWalletContext";

export const CHAIN_CONFIG = {
    polygon: {
        chainNamespace: CHAIN_NAMESPACES.EIP155,
        rpcTarget: 'https://polygon-rpc.com',
        blockExplorer: 'https://polygonscan.com/',
        chainId: '0x89',
        displayName: 'Polygon Mainnet',
        ticker: 'matic',
        tickerName: 'Matic',
    },
    mumbai: {
        chainNamespace: CHAIN_NAMESPACES.EIP155,
        rpcTarget: 'https://rpc-mumbai.maticvigil.com/',
        blockExplorer: 'https://polygonscan.com/',
        chainId: '0x13881',
        displayName: 'Mumbai Testnet',
        ticker: 'matic',
        tickerName: 'Matic',
    }
}

export enum CHAIN_TYPES {
    polygon = 'polygon',
    mumbai = 'mumbai'
}



export interface WalletContextValues {
    web3AuthType: string | null;
    isLoading: boolean;
    connected: boolean;
    accountAddress: string | null;
    accountBalance: number | null;
    login: (adapter: WALLET_ADAPTER_TYPE, torusSocial?: string) => Promise<void>;
    logout: () => Promise<void>;
}


export { WalletContext, WalletProvider };
