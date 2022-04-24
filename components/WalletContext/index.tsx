import React, {createContext, useCallback, useEffect, useState} from 'react';
import {ADAPTER_EVENTS, SafeEventEmitterProvider, WALLET_ADAPTER_TYPE} from "@web3auth/base";
import {Web3AuthCore} from "@web3auth/core";
import {MetamaskAdapter} from "@web3auth/metamask-adapter";
import {TorusWalletAdapter} from '@web3auth/torus-evm-adapter';
import {TorusWalletConnectorPlugin} from '@web3auth/torus-wallet-connector-plugin';
import {WalletConnectV1Adapter} from '@web3auth/wallet-connect-v1-adapter';
import QRCodeModal from '@walletconnect/qrcode-modal';
import ethProvider, {IWalletProvider} from "./ethProvider";
import {CHAIN_CONFIG} from "./chainConfig";
import {LOGIN_MODAL_EVENTS} from "@web3auth/ui";

// const clientId = "BK_OUnw-SX4sFD68X09VtvcVByx87QgeYE7HOnqfhndm888psQx8zO-hBKpE25UIQ4nJKaR1BF4M5e4BIknMcN0";

export enum CHAIN_TYPES {
    polygon = 'polygon',
    mumbai = 'mumbai'
}

interface WalletProviderProps {
    chainType: CHAIN_TYPES;
    children: React.ReactNode;
}

export interface WalletContextValues {
    isLoading: boolean;
    connected: boolean;
    accountAddress: string | null;
    accountBalance: number | null;
    login: (adapter: WALLET_ADAPTER_TYPE, torusSocial?: string) => Promise<void>;
    logout: () => Promise<void>;

}

export const WalletContext = createContext<WalletContextValues>({
    isLoading: false,
    connected: false,
    accountAddress: null,
    accountBalance: null,
    login: async () => {
    },
    logout: async () => {
    },
});

const WalletProvider = ({children, chainType}: WalletProviderProps) => {
    const [web3Auth, setWeb3Auth] = useState<Web3AuthCore | null>(null);
    const [provider, setProvider] = useState<IWalletProvider | null>(null);
    const [user, setUser] = useState<unknown | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const [connected, setConnected] = useState<boolean>(false);
    const [accountAddress, setAccountAddress] = useState<string | null>(null);
    const [accountBalance, setAccountBalance] = useState<number | null>(null);

    const setWalletProvider = useCallback(
        (web3authProvider: SafeEventEmitterProvider) => {
            console.warn('WalletContext - setWalletProvider [chainType] - Setting provider - ethProvider', web3authProvider)
            const walletProvider = ethProvider(web3authProvider);
            setProvider(walletProvider);
        },
        [chainType]
    );


    useEffect(() => {
        if (!provider) {
            console.error('WalletContext -useEffect [provider, chainType] - provider is null');
        } else {

            const initAccountDetails = async () => {
                try {
                    console.warn('WalletContext -useEffect [provider, chainType] - TRYING to getAccounts');
                    const accountAddress = await provider.getAccounts();
                    setAccountAddress(accountAddress);
                    const currentBalance = await provider.getBalance(accountAddress);
                    setAccountBalance(currentBalance)

                } catch (e) {
                    throw(e)
                }
            }

            initAccountDetails();
        }
    }, [provider, chainType])

    useEffect(() => {
        const subscribeAuthEvents = (web3auth: Web3AuthCore) => {
            // Can subscribe to all ADAPTER_EVENTS and LOGIN_MODAL_EVENTS
            web3auth.on(ADAPTER_EVENTS.CONNECTED, (data: unknown) => {
                console.log('XXX - WalletContext -ADAPTER_EVENTS.CONNECTED', data);
                setIsLoading(false);
                setConnected(true)
                setUser(data);
                console.log('WalletContext -ADAPTER_EVENTS.CONNECTED', user);
                setWalletProvider(web3auth.provider as SafeEventEmitterProvider);
            });

            web3auth.on(ADAPTER_EVENTS.CONNECTING, () => {
                setIsLoading(true);
            });

            web3auth.on(ADAPTER_EVENTS.DISCONNECTED, () => {
                console.log('WalletContext - useEffect [] - subscribeAuthEvents - ADAPTER_EVENTS.DISCONNECTED');
                setIsLoading(false);
                setConnected(false);
                setUser(null);
                setProvider(null);
                setAccountAddress(null);
                setAccountBalance(null);
            });

            web3auth.on(ADAPTER_EVENTS.ERRORED, (error: unknown) => {
                console.error('WalletContext - useEffect [] - subscribeAuthEvents - ADAPTER_EVENTS.ERRORED - Some error or user has cancelled login request', error);
                throw (error);
            });
        };

        const init = async () => {
            try {
                const web3auth = new Web3AuthCore({chainConfig: CHAIN_CONFIG[chainType]});

                const metamaskAdapter = new MetamaskAdapter({
                    chainConfig: CHAIN_CONFIG[chainType]
                })

                const torusWalletAdapter = new TorusWalletAdapter({
                    loginSettings: {
                        verifier: '',
                    },
                    initParams: {
                        buildEnv: 'testing',
                    },
                    chainConfig: CHAIN_CONFIG[chainType],
                });

                const walletConnectV1Adapter = new WalletConnectV1Adapter({
                    adapterSettings: {qrcodeModal: QRCodeModal},
                    chainConfig: CHAIN_CONFIG[chainType],
                });

                // const openLoginAdapter = new OpenloginAdapter({
                //         adapterSettings: {
                //             network: "testnet",
                //             clientId,
                //             uxMode: "popup"
                //         },
                //         chainConfig: CHAIN_CONFIG[chainType],
                //
                //     }
                // )

                const torusPlugin = new TorusWalletConnectorPlugin({
                    torusWalletOpts: {buttonPosition: 'bottom-left', modalZIndex: 10},
                    walletInitOptions: {
                        whiteLabel: {
                            theme: {isDark: true, colors: {primary: '#00a8ff'}},
                            logoDark: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
                            logoLight: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
                        },
                        useWalletConnect: true,
                        enableLogging: true,
                    },
                });
                await web3auth.addPlugin(torusPlugin);
                web3auth.configureAdapter(metamaskAdapter);
                web3auth.configureAdapter(torusWalletAdapter);
                web3auth.configureAdapter(walletConnectV1Adapter);
                subscribeAuthEvents(web3auth);
                setWeb3Auth(web3auth);
                await web3auth.init();
            } catch (e) {
                console.error('WalletContext useEffect [] - ', e);
            }
        }

        init();
    }, [chainType])


    const login = async (adapter: WALLET_ADAPTER_TYPE) => {
        try {
            setIsLoading(true);
            if (!web3Auth) {
                console.error('WalletContext login - ', "no web3auth");
                return;
            }
            const localProvider = await web3Auth.connectTo(adapter);
            setWalletProvider(localProvider!);
            // await getAccounts();
        } catch (e) {
            console.error('WalletContext login - ', e);
            throw (e);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            setIsLoading(true);
            if (!web3Auth) {
                console.error('WalletContext logout - ', "no web3auth");
                return;
            }
            await web3Auth.logout();
        } catch (e) {
            console.error('WalletContext logout - ', e);
        } finally {
            setIsLoading(false);

        }
    };

    const context: WalletContextValues = {
        isLoading,
        connected,
        accountAddress,
        accountBalance,
        login,
        logout,
    };


    return (
        <WalletContext.Provider value={context}>
            {children}
        </WalletContext.Provider>
    );
}

export default WalletProvider;
