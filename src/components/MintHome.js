import React, { useEffect, useMemo, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector }    from "@web3-react/walletlink-connector";

import ContractAbi from '../artifacts/contracts/FXC.json';
import Modal from './Modal.js';
import "./MintHome.css";

import { ethers } from 'ethers';
import EthereumSession from '../lib/eth-session.js';

/*
const mainnetConfig = {
    'CONTRACT': '0x68cf439BA5D2897524091Ef81Cb0A3D1F56E5500',
    'CHAIN_ID':  1,
    'RPC_URL':   process.env.INFURA_API_MAINNET_KEY,
    'ABI':       ContractAbi
}
*/

const rinkebyConfig = {
    'CONTRACT': '0xF261cbb26428B8c1DE64fb729c60E0C5c31D8748',
    'CHAIN_ID':  4,
    'RPC_URL':   process.env.INFURA_API_RINKEBY_KEY,
    'ABI':       ContractAbi
}


const config = rinkebyConfig;

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
    const [howManyTokens, setHowManyTokens] = useState(0)
    const [isActive, setIsActive] = useState(false);
    const [holdings, setHoldings] = useState(null);
    const [maxMintSilver, setMaxMintSilver] = useState(0);
    const [maxMintGold, setMaxMintGold] = useState(0);
    const [color, setColor] = useState("SILVER")

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

        setMaxMintGold(Math.min(parseInt(holdings[0].balance, 10), parseInt(holdings[1].balance, 10)));
        setMaxMintSilver(parseInt(holdings[0].balance + holdings[1].balance, 10));
        setHowManyTokens(parseInt(holdings[0].balance + holdings[1].balance, 10));
    }

    async function mint (tokenType) { 
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
            const price = String(tokenPrice * howManyTokens)

            const overrides = {
                from: walletAddress,
                value: price
            }

            const gasBN = await ethereumSession.contract.estimateGas.mint(walletAddress, howManyTokens, overrides);
            const finalGasBN = gasBN.mul( ethers.BigNumber.from(11) ).div( ethers.BigNumber.from(10) );
            overrides.gasLimit = finalGasBN.toString();

            const txn = await contractWithSigner.mint(walletAddress, howManyTokens, overrides)
            await txn.wait();
            setMintingSuccess(howManyTokens)
        } catch (error) {
            if (error.error) {
                setMintingError(error.error.message)
            } 
        }
    }

    const setMintingSuccess = (howManyTokens) => {
        setErrorMessage("Congrats on minting " + howManyTokens + "  Bit Bots!!");
        toggleModal(true);
    }

    const setMintingError = (error) => {
        setErrorMessage(error);
        toggleModal(true);
    }

    function checkHowMany (newNumber) { 
        if (color === "GOLD") { 
            if (newNumber > maxMintGold) {
                setHowManyTokens(maxMintGold)
            } else if (newNumber < 0) { 
                setHowManyTokens("")
            } else { 
                setHowManyTokens(newNumber) 
            }
        } else if (color === "SILVER"){ 
            if (newNumber > maxMintSilver) {
                setHowManyTokens(maxMintSilver)
            } else if (newNumber < 0) { 
                setHowManyTokens("")
            } else { 
                setHowManyTokens(newNumber) 
            }
        }
        
    }

    function onChangeValue (event) {
        setColor(event.target.value);
    }

    const oneTextSilver = howManyTokens < 2 && howManyTokens > 0 ? "MINT " + howManyTokens + " SILVER PENDANTS!" : "MINT " + howManyTokens + " SILVER PENDANTS!";
    const zeroTextSilver = howManyTokens < 1 ? "MUST MINT ATLEAST 1 SILVER PENDANT" : oneTextSilver;
    const noSilver = maxMintSilver > 0 ? zeroTextSilver : "NOT ELIGIBLE TO MINT SILVER PENDANT";
    const buttonTextSilver = signedIn ?  noSilver: "CONNECT WALLET TO MINT";


    const oneTextGold = howManyTokens < 2 && howManyTokens > 0 ? "MINT " + howManyTokens + " GOLD PENDANTS!" : "MINT " + howManyTokens + " GOLD PENDANTS!";
    const zeroTextGold = howManyTokens < 1 ? "MUST MINT ATLEAST 1 GOLD PENDANT" : oneTextGold;
    const noGold = maxMintGold > 0 ? zeroTextGold : "NOT ELIGIBLE TO MINT GOLD PENDANT";
    const buttonTextGold = signedIn ?  noGold : "CONNECT WALLET TO MINT"

    const buttonText = color === "GOLD" ? buttonTextGold : buttonTextSilver;

    const paraTextSilver = signedIn ? "INPUT NUMBER OF SILVER PENDANTS TO MINT (0.06 ETH): " : "CONNECT WALLET ABOVE TO MINT PENDANTS!"
    const paraTextGold = signedIn ? "INPUT NUMBER OF GOLD PENDANTS TO MINT (0.06 ETH): " : "CONNECT WALLET ABOVE TO MINT PENDANTS!"

    return (
        <div id="#home">
            <div className="minthomeBg" />
            <div className="minthome__wrapper">
                <div className="minthome__container">
                    <div className="minthome__info">
                        <h1>CATHARSIS X THE FOXXIES</h1>
                        <h2>MINT A PENDANT HERE PENDANT (.06 ETH)</h2>
                        <div className="minthome__signIn"> 
                            {!signedIn ? <button onClick={signIn}>CONNECT WALLET</button>
                                : <button onClick={signOut}>WALLET CONNECTED<br /> CLICK TO SIGN OUT</button>
                            }
                        </div>

                        <div onChange={onChangeValue} className="form">
                            <label class="form-control">
                                <input 
                                    type="radio" 
                                    name="radio" 
                                    value="SILVER"
                                    checked={color === 'SILVER'}
                                />
                                SILVER
                            </label>

                            <label class="form-control">
                                <input 
                                    type="radio" 
                                    name="radio" 
                                    value="GOLD"
                                    checked={color=== 'GOLD'}
                                />
                                GOLD
                            </label>
                        </div>
                        
                        <p>{color === "GOLD" ? paraTextGold : paraTextSilver}</p>
                        
                        <div className={signedIn ? "minthome__signIn-input" : "minthome__signIn-input-false"}>
                            <input 
                                type="number" 
                                min="1"
                                max={color === "GOLD" ? maxMintGold : maxMintSilver}
                                value={howManyTokens}
                                onChange={ e => checkHowMany(e.target.value) }
                                name="" 
                            />
                        </div>
                        
                        <br/>
                        
                        <div className={color === "GOLD" ? "minthome__mintGold" : "minthome__mintSilver"}>
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