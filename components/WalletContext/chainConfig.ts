import { CHAIN_NAMESPACES } from '@web3auth/base';

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
