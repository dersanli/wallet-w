import React, {useContext, useState} from 'react';
import {WalletContext, WalletContextValues} from "../components/WalletContext";
import {WALLET_ADAPTERS} from "@web3auth/base";


const CustomAuth = () => {
    const [wError, setWError] = useState('')

    const {isLoading, connected, accountPublicKey, login, logout, getAccounts}: WalletContextValues = useContext(WalletContext);

    const handleMetamaskLogin = async () => {
        try {
            console.log('logging in - metamask')
            await login(WALLET_ADAPTERS.METAMASK)

        } catch (e) {
            console.error('handleMetamaskLogin', e)
        }
    }

    const handleTorusEvmLogin = async () => {
        try {
            console.log('logging in - torus evm')
            await login(WALLET_ADAPTERS.TORUS_EVM)
        } catch (e) {
            console.error('handleTorusEvmLogin', e)
            // @ts-ignore
            setWError(e.toString());
        }
    }


    const handleLogout = async () => {
        try {
            console.log('logging out')
            logout()
        } catch (e) {
            console.error('handleLogout', e)
        }
    }


    // @ts-ignore
    const WButton = ({label, onClick}) =>
        <div
            className=' flex w-48 h-12 bg-indigo-800 cursor-pointer m-8 rounded items-center justify-center text-cyan-50'
            onClick={()=>{
                setWError('');
                onClick();
            }}>{label}</div>


    return (
        <>
            {/*<div className='h-12 bg-gray-700 text-cyan-50'>Provider: {!provider ? 'isNull' : typeof provider}</div>*/}
            <div className='h-12'>Loading: {isLoading? 'true' : 'false'} - Connected: {connected? 'true' : 'false'}</div>
            <div className={`${wError === '' ? 'text-black' : 'text-red-800'} h-12`}>Error: {wError === '' ? 'none' : wError}</div>
            <div className='h-12'>Account Public Key: {accountPublicKey}</div>
            <div>
                {connected ?
                    <>
                        <WButton label={'logout'} onClick={handleLogout}/>
                        <WButton label={'get accounts'} onClick={getAccounts}/>
                    </> :
                    <>
                        <WButton label={'login - metamask'} onClick={handleMetamaskLogin}/>
                        <WButton label={'login - torus evm'} onClick={handleTorusEvmLogin}/>
                    </>
                }
            </div>
        </>
    )
}

export default CustomAuth;
