import React, { createContext, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from '@reduxjs/toolkit';
import {
    BinanceService,
    ContractService,
    MetamaskService,
    backendService,
} from "../../services/";
import { userActions, modalActions, noteActions, walletActions, /*pendingActions*/ } from "../../redux/index";
import { transactionActions } from "../../redux";
const contractContext = createContext({
    walletService: null,
    contractService: null,
});

const ContractProvider = ({ children }) => {
    const [walletService, setWalletService] = React.useState(null);
    const [contractService, setContract] = React.useState(null);
    const [contractDetails, setContractDetails] = React.useState(null);

    const dispatch = useDispatch();
    const setUserData = data => dispatch(userActions.default.setUserData(data));
    const { addNote } = bindActionCreators(noteActions, dispatch);
    const { toggleAlertModal } = bindActionCreators(modalActions, dispatch);
    const { setContractService } = bindActionCreators(transactionActions, dispatch);
    const setWalletDex = data => dispatch(walletActions.default.setWalletDex(data));
    const { type: walletType, networkFrom, networkType } = useSelector(({ wallet }) => wallet);

    const loginMetamask = async () => {
        try {
            console.log("loginMetamask", networkFrom, contractDetails);
            const wallet = new MetamaskService({
                networkType,
                networkFrom,
                contractDetails,
            });
            await window.ethereum.enable();
            setContract(
                new ContractService({
                    wallet,
                    networkFrom,
                    contractDetails,
                })
            );
            setWalletService(wallet);
            const account = await wallet.getAccount();
            setUserData(account);
        } catch (e) {
            console.error(e);
            if (!e.errorMsg || e.errorMsg === "") {
                toggleAlertModal({
                    isOpen: true,
                    text: (
                        <div className="modal-alert__text">
                            <p>Metamask extension is not found.</p>
                            <p>
                  You can install it from{" "}
                                <a href="https://metamask.io" target="_blank" rel="noreferrer">
                    metamask.io
                                </a>
                            </p>
                        </div>
                    ),
                });
            } else {
                addNote(e.errorMsg);
            }
        }
    };

    const loginBinance = async () => {
        try {
            console.log("loginBinance", networkFrom);
            const wallet = new BinanceService({
                networkType,
                networkFrom,
                contractDetails,
            });
            setContract(
                new ContractService({
                    wallet,
                    networkFrom,
                    contractDetails,
                })
            );
            setWalletService(wallet);
            const account = await wallet.getAccount();
            setUserData(account);
        } catch (e) {
            console.error(e);
            if (!e.errorMsg || e.errorMsg === "") {
                toggleAlertModal({
                    isOpen: true,
                    text: (
                        <div className="modal-alert__text">
                            <p>Binance Chain Wallet is not found.</p>
                            <p>
                  You can install it from{" "}
                                <a href="https://www.binance.org" target="_blank" rel="noreferrer">
                    binance.org
                                </a>
                            </p>
                        </div>
                    ),
                });
            } else {
                addNote(e.errorMsg);
            }
        }
    };

    const getDex = async () => {
        try {
            // dispatch(pendingActions.default.setPendingState({ isPendingNetworks: true }));
            const resultGetDex = await backendService.getDex();
            console.log("ContractContext resultGetDex", resultGetDex);
            // const resultGetDex = contractModel;
            const newDex = resultGetDex;
            setWalletDex(newDex);

            const tokens = newDex.tokens;

            if (!newDex)
                return addNote(
                    "Server is offline",
                );

            if (tokens && !tokens[0])
                return addNote(
                    "Server is offline",
                );

            const binanceSmartChain = tokens.filter(
                item => item.num === 1
            )[0];

            const ethereumChain = tokens.filter(
                item => item.num === 2
            )[0];

            const polygonChain = tokens.filter(item => item.num === 3)[0];
            const tronChain = tokens.filter(item => item.network === 'Tron')[0];

            const contractDetails = {
                ADDRESS: {
                    TOKEN: {
                        Ethereum: ethereumChain?.token_address,
                        "Binance-Smart-Chain": binanceSmartChain?.token_address,
                        Polygon: polygonChain?.token_address,
                        Tron: tronChain?.token_address,
                    },
                    SWAP: {
                        Ethereum: ethereumChain?.swap_address,
                        "Binance-Smart-Chain": binanceSmartChain?.swap_address,
                        Polygon: polygonChain?.swap_address,
                        Tron: tronChain?.swap_address,
                    },
                },
                DECIMALS: {
                    TOKEN: {
                        Ethereum: ethereumChain?.decimals,
                        "Binance-Smart-Chain": binanceSmartChain?.decimals,
                        Polygon: polygonChain?.decimals,
                        Tron: tronChain?.decimals,
                    },
                    SWAP: {
                        Ethereum: ethereumChain?.decimals,
                        "Binance-Smart-Chain": binanceSmartChain?.decimals,
                        Polygon: polygonChain?.decimals,
                        Tron: tronChain?.decimals,
                    },
                },
                ABI: {
                    TOKEN: {
                        Ethereum: ethereumChain?.token_abi,
                        "Binance-Smart-Chain": binanceSmartChain?.token_abi,
                        Polygon: polygonChain?.token_abi,
                        Tron: tronChain?.token_abi,
                    },
                    SWAP: {
                        Ethereum: ethereumChain?.swap_abi,
                        "Binance-Smart-Chain": binanceSmartChain?.swap_abi,
                        Polygon: polygonChain?.swap_abi,
                        Tron: tronChain?.swap_abi,
                    },
                },
            };
            setContractDetails(contractDetails);
            // dispatch(pendingActions.default.setPendingState({ isPendingNetworks: false }));
        } catch (e) {
            // dispatch(pendingActions.default.setPendingState({ isPendingNetworks: false }));
            console.error(e);
        }
    };

    React.useEffect(() => {
        console.log("ContractContext useEffect walletType", walletType);
        (async () => {
            await getDex();
        })();
    }, [walletType, networkType]);

    React.useEffect(() => {
        console.log("ContractContext useEffect contractDetails", contractDetails);
        if (!contractDetails) return;
        (async () => {
            const walletTypeOnReload = localStorage.getItem("walletTypeOnReload");
            if (walletType === "metamask" || walletTypeOnReload === "metamask") {
                loginMetamask();
            } else if (walletType === "binance" || walletTypeOnReload === "binance") {
                loginBinance();
            }
            localStorage.setItem("walletTypeOnReload", "");
        })();
    }, [contractDetails]);

    React.useEffect(() => {
        setUserData({ address: '' });
    }, [networkType]);

    React.useEffect(() => {
        setContractService(contractService);
    }, [contractService]);

    return (
        <contractContext.Provider value={{ walletService, contractService }}>
            {children}
        </contractContext.Provider>
    );
};

export default ContractProvider;

export function useContractContext() {
    return useContext(contractContext);
}
