import { SafeEventEmitterProvider } from '@web3auth/base';
import { ethers } from 'ethers';
import Web3 from "web3";

export interface IWalletProvider {
    getAccounts: () => Promise<any>;
    getBalance: () => Promise<any>;
    signPurchase: (tokenAddress: string, tokenId: string) => Promise<void>;
    checkTxn: (txn: string) => Promise<any>;
    lalala: () => Promise<any>;
}

const ethProvider = ( provider: SafeEventEmitterProvider ): IWalletProvider => {

    const getAccounts = async () => {
        try {

            if(provider === undefined)
            {
                console.error('ethProvider - getAccounts', provider)
                return;
            }

            console.warn('ethProvider - getAccounts', provider)

            const web3 = new Web3(provider as any);
            const accounts = await web3.eth.getAccounts();

            return accounts[0];
        } catch (error) {
            console.error("getAccounts Error", error);
        }
    };

    const getBalance = async () => {
        try {
            const web3 = new ethers.providers.Web3Provider(provider as any);

            const accounts = await web3.listAccounts();
            const balance = await web3.getBalance(accounts[0]);
            const formattedBalance = parseFloat(ethers.utils.formatEther(balance)).toFixed(3);
            return formattedBalance;
        } catch (error) {
            console.error('Error', error);
        }
    };

    const signPurchase = async (tokenAddress: string, tokenId: string) => {
        const web3 = new ethers.providers.Web3Provider(provider as any);
        const signer = web3.getSigner();
        try {
            const abi = ['function mint(address account, uint256 tokenId) external payable'];
            const contract = new ethers.Contract(tokenAddress, abi, signer);
            const tx = await contract.mint(signer.getAddress(), tokenId, {
                value: '0x174876E800',
            });
            return tx;
        } catch (e) {
            console.log(e);
            return e;
        }
    };

    const checkTxn = async (txn: string) => {
        console.log('called');
        const web3 = new ethers.providers.Web3Provider(provider as any);
        // const signer = web3.getSigner();
        try {
            const txnCheck = await web3.getTransactionReceipt(txn);
            console.log(txnCheck);
            return txnCheck;
        } catch (e) {
            console.log(e);
            return e;
        }
    };


    const lalala = async () => {
        console.log('lalalal')
        return 555;
    }

    return { getAccounts, getBalance, signPurchase, checkTxn, lalala };
};

export default ethProvider;
