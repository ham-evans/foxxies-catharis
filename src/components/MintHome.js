import React, { useEffect, useMemo, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector }    from "@web3-react/walletlink-connector";

import ContractAbi from '../artifacts/contracts/FXC.json';
import Modal from './Modal.js';
import "./MintHome.css";

import { ethers } from 'ethers';
import EthereumSession from '../lib/eth-session.js';

const mainnetConfig = {
    'CONTRACT': '0x5e9368831db40964a3bc88546d62c8c10a10929d',
    'CHAIN_ID':  1,
    'RPC_URL':   process.env.INFURA_API_MAINNET_KEY,
    'ABI':       ContractAbi
}

/*
const rinkebyConfig = {
    'CONTRACT': '0xA13F4f9f978f2e7B14161f4C3b9eEAFA32064aCa',
    'CHAIN_ID':  4,
    'RPC_URL':   process.env.INFURA_API_RINKEBY_KEY,
    'ABI':       ContractAbi
}
*/


const config = mainnetConfig;

const CONNECTORS = {};
CONNECTORS.Walletlink = new WalletLinkConnector({
    url: config.RPC_URL,
    appLogoUrl: null,
    appName: "Foxxies X Catharsis",
});

CONNECTORS.WalletConnect = new WalletConnectConnector({
    supportedChainIds: [config.CHAIN_ID],
    rpc: config.RPC_URL,
});

export default function MintHome () {
    const context = useWeb3React();
    
    const [walletAddress, setWalletAddress] = useState(null);

    const signedIn = !!walletAddress;

    const [contract, setContract] = useState(null);
    const [contractWithSigner, setContractWithSigner] = useState(null);
    const [tokenPrice, setTokenPrice] = useState(0);
    const [howManyTokensSilver, setHowManyTokensSilver] = useState(0)
    const [howManyTokensGold, setHowManyTokensGold] = useState(0)
    const [isActive, setIsActive] = useState(false);
    const [holdings, setHoldings] = useState(null);
    const [maxMintSilver, setMaxMintSilver] = useState(0);
    const [maxMintGold, setMaxMintGold] = useState(0);

    const [modalShown, toggleModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const ethereumSession = useMemo(() => {
        if( window.ethereum ){
            const session = new EthereumSession({
                chain:           EthereumSession.COMMON_CHAINS[ config.CHAIN_ID ],
                contractAddress: config.CONTRACT,
                contractABI:     config.ABI
            });
            return session;
        }
        else{
            return null;
        }
    },[]);

    useEffect(() => { 
        if( window.ethereum ){
            ethereumSession.connectEthers()
                .then(() => loadContractData(ethereumSession.wallet.accounts[0]))
                .then(() => {
                    if( ethereumSession.hasAccounts() )
                        setWalletAddress( ethereumSession.wallet.accounts[0] );
                })
                .catch( err => {
                    if( err.code === "CALL_EXCEPTION" ){
                        //we're on the wrong chain
                    }
                    else{
                        debugger
                    }
                })
        }
    }, []);

    async function connectProvider( connector ){
        context.activate( connector, async (err) => {
          //other connectors
          if( err.code === 4001 ){
            //WalletLink: User denied account authorization
            console.debug( err.message );
            return;
          }
          else if( err.name === 'UserRejectedRequestError' ){
            //WalletConnect: The user rejected the request
            console.debug( err.message );
            return;
          }
          else{
            console.warn( err.message );
          }
        });
    }

    function redirect( to ){
        if( to === 'metamask' ){
            const link = 'https://metamask.app.link/dapp/'+ window.location.href.substr( 8 );
            window.location = link;
        }
        else if( to === 'trustwallet' ){
            const link = 'https://link.trustwallet.com/open_url?coin_id=60&url='+ window.location.href;
            window.location = link;
        }
    }

    async function signIn() { 
        if ( !window.ethereum ) {
            setErrorMessage(<div id="providers">
                <p>No Ethereum interface injected into browser.<br />Other providers:</p>
                <ul>
                    <li onClick={() => connectProvider( CONNECTORS.Walletlink )}>&bull; Coinbase Wallet</li>
                    <li onClick={() => redirect( 'metamask' )}>&bull; MetaMask</li>
                    <li onClick={() => redirect( 'trustwallet' )}>&bull; Trust Wallet</li>
                    <li onClick={() => connectProvider( CONNECTORS.WalletConnect )}>&bull; WalletConnect</li>
                </ul>
            </div>);
            toggleModal(true);
            return;
        }

        try{
            let curChain = await ethereumSession.getWalletChainID();
            await ethereumSession.connectEthers( true );
            if( curChain !== ethereumSession.chain.hex ){
                curChain = await ethereumSession.getWalletChainID();
                if( curChain === ethereumSession.chain.hex ){
                    //force the browser to switch to the new chain
                    window.location.reload();
                    return;
                } else {
                    setErrorMessage( `Switch network to the ${ethereumSession.chain.name} before continuing.`)
                    toggleModal(true);
                    return;
                }
            }

            if (ethereumSession.hasAccounts()) {
                setWalletAddress(ethereumSession.wallet.accounts[0])
                await loadContractData(ethereumSession.wallet.accounts[0])
            }
        }
        catch( error ){
            if (error.code === 4001) {
                setErrorMessage("Sign in to mint pendants!")
                toggleModal(true);
            } else { 
                setErrorMessage(error)
                toggleModal(true);
            }
        }
    }

    async function signOut() {
        setWalletAddress(null)
    }

    async function loadContractData (wallet) {
        const contract = ethereumSession.contract;
        const signer = ethereumSession.ethersProvider.getSigner();
        const contractWithSigner = contract.connect(signer)
        const tokenPrice = await contract.PRICE();
        const isActive = await contract.isActive();
        const holdings = await contract.checkHoldings(wallet);

        setContract(contract);
        setContractWithSigner(contractWithSigner);
        setTokenPrice(tokenPrice);
        setIsActive(isActive);
        setHoldings(holdings);

        setMaxMintGold(Math.min(parseInt(holdings[0].balance), parseInt(holdings[1].balance)));
        setMaxMintSilver(parseInt(holdings[0].balance) + parseInt(holdings[1].balance));
        setHowManyTokensGold(Math.min(parseInt(holdings[0].balance), parseInt(holdings[1].balance)));
        setHowManyTokensSilver(parseInt(holdings[0].balance) + parseInt(holdings[1].balance));
    }

    async function mint () { 
        if (!signedIn || !contractWithSigner){
            setErrorMessage("Please connect wallet or reload the page!")
            toggleModal(true);
            return
        }

        if( !isActive ){
            setErrorMessage("Sale is not active right now.  Try again later!")
            toggleModal(true);
            return;
        }

        if( !(await ethereumSession.connectAccounts( true )) ){
            setErrorMessage("Please unlock your wallet and select an account.")
            toggleModal(true);
            return;
        }

        if( !(await ethereumSession.connectChain( true )) ){
            setErrorMessage(`Please open your wallet and select ${ethereumSession.chain.name}.`);
            toggleModal(true);
            return;
        }

        if ( ethereumSession.chain.hex !== await ethereumSession.getWalletChainID() ){
            window.location.reload();
            return;
        }

        //connected
        try{
            const price = String(tokenPrice * (howManyTokensGold + howManyTokensSilver));
            
            const overrides = {
                from: walletAddress,
                value: price
            }

            const gasBN = await ethereumSession.contract.estimateGas.mint([howManyTokensGold, howManyTokensSilver], overrides);
            const finalGasBN = gasBN.mul( ethers.BigNumber.from(11) ).div( ethers.BigNumber.from(10) );
            overrides.gasLimit = finalGasBN.toString();

            const txn = await contractWithSigner.mint([howManyTokensGold, howManyTokensSilver], overrides)
            await txn.wait();
            setMintingSuccess(howManyTokensSilver + howManyTokensGold)
        } catch (error) {
            console.log(error);
            if (error.error) {
                setMintingError(error.error.message)
            } 
        }
    }

    const setMintingSuccess = (howManyTokensSilver, howManyTokensGold) => {
        setErrorMessage("Congrats on minting " + (howManyTokensSilver + howManyTokensGold) + "  Bit Bots!!");
        toggleModal(true);
    }

    const setMintingError = (error) => {
        setErrorMessage(error);
        toggleModal(true);
    }

    function checkHowManySilver (newNumber) { 
        if (newNumber > maxMintSilver) {
            setHowManyTokensSilver(maxMintSilver)
        } else if (newNumber < 0) { 
            setHowManyTokensSilver("")
        } else { 
            setHowManyTokensSilver(newNumber) 
        }
    }

    function checkHowManyGold (newNumber) { 
        if (newNumber > maxMintGold) {
            setHowManyTokensGold(maxMintGold)
        } else if (newNumber < 0) { 
            setHowManyTokensGold("")
        } else { 
            setHowManyTokensGold(newNumber) 
        }
    }

    const howManyTokens = parseInt(howManyTokensSilver) + parseInt(howManyTokensGold);

    const oneText = howManyTokens < 2 && howManyTokens > 0 ? "MINT " + howManyTokens + " PENDANTS!" : "MINT " + howManyTokens + " PENDANTS!";
    const zeroText = howManyTokensGold === "" ? "MUST MINT ATLEAST 1 PENDANT" : oneText;
    const nextText = howManyTokensSilver === "" ? "MUST MINT ATLEAST 1 PENDANT" : zeroText;
    const finalText = howManyTokens < 1 ? "MUST MINT ATLEAST 1 PENDANT" : nextText;

    const buttonText = signedIn ?  finalText : "CONNECT WALLET TO MINT"

    const paraText = signedIn ? "INPUT NUMBER OF PENDANTS TO MINT (0.06 ETH): " : "CONNECT WALLET ABOVE TO MINT PENDANTS!"

    return (
        <div id="#home">
            <div className="minthomeBg" />
            <div className="minthome__wrapper">
                <div className="minthome__container">
                    <div className="minthome__info">
                        <h1>CATHARSIS X THE FOXXIES</h1>
                        <h2>MINT A PENDANT HERE (.06 ETH)</h2>
                        <div className="minthome__signIn"> 
                            {!signedIn ? <button onClick={signIn}>CONNECT WALLET</button>
                                : <button onClick={signOut}>WALLET CONNECTED</button>
                            }
                        </div>

                        <p>{paraText}</p>
                        
                        <div className="minthome__inputs">
                            <div className="minthome__signIn-inputSilver">
                                <input 
                                    type="number" 
                                    min="0"
                                    max={maxMintSilver}
                                    value={howManyTokensSilver}
                                    onChange={ e => checkHowManySilver(e.target.value) }
                                    name="" 
                                />
                                <p>SILVER PENDANTS</p>
                            </div>

                            <div className="minthome__signIn-inputGold">
                                <input 
                                    type="number" 
                                    min="0"
                                    max={maxMintGold}
                                    value={howManyTokensGold}
                                    onChange={ e => checkHowManyGold(e.target.value) }
                                    name="" 
                                />
                                <p>GOLD PENDANTS</p>
                            </div>
                        </div>
                        
                        <br/>
                        
                        <div className="minthome__mint">
                            {howManyTokens > 0 ? <button onClick={() => mint()}>{buttonText}</button>
                                : <button>{buttonText}</button>
                            }
                        </div>
                </div>
                </div>
            </div>

            <Modal
                shown={modalShown}
                close={() => {
                    toggleModal(false);
                }}
                message={errorMessage}
            ></Modal>
        </div>
    );
}