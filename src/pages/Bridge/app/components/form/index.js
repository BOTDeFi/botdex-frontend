/* eslint-disable camelcase */
import React from 'react';

import './style.scss';
import variables from './style.scss';

import Dropdown from './dropdown';
import Label from './input-label';
import LabelLink from './input-label-link';
import Input from './input';
import Note from './note';
import Button from '../button';
import BigNumber from 'bignumber.js/bignumber';

import WalletIcon from '../../assets/images/wallet_icon.svg';

import * as config from '../../config/config_front';
import * as configBack from '../../config/config_back';
// import * as configBack from "../../config/config_back";

import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from '@reduxjs/toolkit';
import { progressActions,
    modalActions,
    formDataActions,
    walletActions,
    noteActions,
    userActions,
    pendingActions, transactionActions } from '../../redux/index';
import { useContractContext } from "../../contexts/contractContext";
import backendService from '../../services/backend';
import { setToStorage } from '../../services/storage';
import { ClipLoader } from "react-spinners";
import { ReactComponent as ArrowIcon } from '../../assets/images/arrow_right.svg';
import { css } from "@emotion/react";

import TransactionService from '../../services/transaction';

const transactionService = new TransactionService();

const Form = () => {
    const defaultNetworkFrom = localStorage.getItem("defaultNetworkFrom");
    const { contractService } = useContractContext();

    const dispatch = useDispatch();
    const { setStepDone } = bindActionCreators(progressActions, dispatch);
    const { toggleChooseWalletModal, toggleAlertModal } = bindActionCreators(modalActions, dispatch);
    const { addNote } = bindActionCreators(noteActions, dispatch);
    const formValidActions = bindActionCreators(formDataActions, dispatch);
    const setWalletNetworkTo = data => dispatch(walletActions.default.setWalletNetTo(data));
    const setWalletNetworkFrom = data => dispatch(walletActions.default.setWalletNetFrom(data));
    const { setAmount,
        setNetworkFromSelected,
        setNetworkToSelected, setContractService } = bindActionCreators(transactionActions, dispatch);


    const { isTokenValid, isWalletValid,
        isDestinationValid, isAmountValid,
        isValidForm } = useSelector(state => state.formData);
    const { isPendingFee, isPendingAmount } = useSelector(({ pending }) => pending);
    const { amount, waiting,
        approved, approving } = useSelector(({ transaction }) => transaction);

    // input's variables
    // const [amount, setAmount] = React.useState('');
    const [destination, setDestination] = React.useState('');
    const [receive, setReceive] = React.useState('');
    const [addressFrom, setTokenAddressFrom] = React.useState("");
    const [addressTo, setTokenAddressTo] = React.useState("");
    //wallet connetion
    const { address: userAddress } = useSelector(({ user }) => user);
    const wallet = useSelector(({ wallet }) => wallet);
    const { dex } = useSelector(({ wallet }) => wallet);
    //dropdown's variables
    const [token, setToken] = React.useState(config.tokensList[0]);
    const [networkFromList] = React.useState(config.networksFrom);
    const [networkToList, setNetworkToList] = React.useState(config.networksTo.filter(item =>
        item.name !== (defaultNetworkFrom ? defaultNetworkFrom : config.networksFrom[0].name)
    ));
    const [networkTo, setNetworkTo] = React.useState(config.networksTo[1]);
    const [networkFrom, setNetworkFrom] = React.useState(
        config.networksFrom.filter(item => item.key === wallet.networkFrom)[0]
    );

    const handleSetNetworkFromSelected = value => {
        try {
            dispatch(walletActions.default.setWalletType(null));
            // dispatch(userActions.default.setUserData({ address: null }));
            setNetworkFrom(value);
            setToStorage("defaultNetworkFrom", value);
            dispatch(walletActions.default.setWalletNetFrom(value));
        } catch (e) {
            console.error(e);
        }
    };
    //test inputs(will bу recieved from server)
    const [fee, setFee] = React.useState(0);
    const [minAmount, setMinAmount] = React.useState(0);

    const getAddresses = () => {
        try {
            if (!dex) return;
            const networkIdFrom = networkFrom.id;
            const networkIdTo = networkTo.id;
            console.log(networkIdFrom, networkIdTo);
            const dexFrom = dex.tokens.filter(
                item => item.num === networkIdFrom
            )[0];
            const dexTo = dex.tokens.filter(item => item.num === networkIdTo)[0];
            setTokenAddressFrom(dexFrom?.token_address);
            setTokenAddressTo(dexTo?.token_address);
        } catch (e) {
            console.error(e);
        }
    };

    React.useEffect(() => {
        setContractService(contractService);
    }, [contractService]);

    React.useEffect(() => {
        setNetworkFromSelected(networkFrom);
        setNetworkToSelected(networkTo);
    }, [networkTo, networkFrom]);


    React.useEffect(() => {
        if (token.id !== 0) {
            formValidActions.setValidationToken(true);
        } else {
            formValidActions.setValidationToken(false);
        }
    }, [token]);
    React.useEffect(async () => {
        let flag = false;
        if (amount && +amount >= +minAmount) {
            if (userAddress) {
                const balance = await contractService.balanceOf(userAddress);
                const balanceTo = await contractService.balanceOfTo(networkTo.key);
                console.log('Balances: ', balance, balanceTo);
                flag = +amount <= +balance;
            } else {
                flag = true;
            }
        }
        formValidActions.setValidationAmount(flag);
    }, [amount]);
    React.useEffect(() => {
        if (destination && destination.match(/^0x/)) {
            formValidActions.setValidationDestination(true);
        } else {
            formValidActions.setValidationDestination(false);
        }
    }, [destination]);
    React.useEffect(() => {
        if (!userAddress) {
            formValidActions.setValidationWallet(false);
            setStepDone(0, false);
        } else {
            transactionService.checkAllowance();
            formValidActions.setValidationWallet(true);
            setStepDone(0, true);
        }
    }, [userAddress, amount]);
    //change toList, when fromListSelect was selected
    React.useEffect(() => {
        console.log(111, networkFrom);
        userAddress &&
        contractService.switchNetwork(networkFrom).then(res => {
            if (res?.code === 4001) {
                addNote(`Please choose ${configBack?.netType} network in your metamask wallet`);
                dispatch(userActions.default.setUserData({ address: '' }));
            }
        });

        localStorage.setItem("defaultNetworkFrom", JSON.stringify(networkFrom.key));
        setWalletNetworkFrom(networkFrom.key);
        setNetworkToList(config.networksTo.filter(item =>
            item.name !== networkFrom.name
        ));
    }, [networkFrom]);

    React.useEffect(async () => {
        setWalletNetworkTo(networkTo.key);
        dispatch(pendingActions.default.setPendingStateFee(true));
        dispatch(pendingActions.default.setPendingStateMinAmount(true));
        console.log(isPendingAmount, isPendingAmount);
        await backendService.updateNetworks().then(async () => {
            dispatch(pendingActions.default.setPendingStateFee(false));
            dispatch(pendingActions.default.setPendingStateMinAmount(false));
            setFee(await backendService.getFee(networkTo));
            setMinAmount(await backendService.getMinimumAmount(networkTo));
        });
        getAddresses();
    }, [networkTo]);

    React.useEffect(() => {
        getAddresses();
    }, [dex]);

    React.useEffect(() => {
        if (networkTo.name === networkFrom.name)
            setNetworkTo(networkToList[0]);
    }, [networkToList]);

    //check form validation
    React.useEffect(() => {
        if (isWalletValid &&
            (isTokenValid || !config.isSelectToken) &&
            (isDestinationValid || !config.isDestinationAddress) &&
            receive && isAmountValid) {
            formValidActions.setValidForm(true);
        } else {
            formValidActions.setValidForm(false);
        }
    }, [isWalletValid, isAmountValid,
        isTokenValid, isDestinationValid, receive]);

    React.useEffect(() => {
        isValidForm ? setStepDone(1, true) : setStepDone(1, false);
    }, [isValidForm]);

    React.useEffect(() => {
        if (+amount < +fee || +amount < +minAmount)
            setReceive('');
        else
            setReceive(new BigNumber(amount).minus(amount * (fee / 100)).toFixed().toString());
    }, [amount]);

    React.useEffect(() => {
        setStepDone(2, approved);
    }, [approved]);

    return (
        <form className='form'>
            {/* dropdowns */}
            {config.isSelectToken ?
                (<>
                    <Label text="Select token"/>
                    <Dropdown selected={token} list={config.tokensList } setSelected={setToken}/>
                </>) :
                null
            }
            <Label text="From" additional={userAddress ?
                `${userAddress.substr(0, 5)}...${userAddress.substr(-5, 5)}` :
                "your wallet"} additionalImg={WalletIcon}/>
            <Dropdown selected={networkFrom} list={networkFromList} setSelected={handleSetNetworkFromSelected}/>
            <Label text="To" />
            <Dropdown selected={networkTo} list={networkToList} setSelected={setNetworkTo}/>

            {/* inputs */}
            <LabelLink text="Amount"
                linkText={config?.tokenLinks[networkFrom?.key][configBack?.netType]?.symbol}
                link={`${config?.tokenLinks[networkFrom?.key][configBack?.netType]?.link}token/${addressFrom}`} />
            <Input value={amount}
                setFunction={ value => {
                    setAmount(value);
                }} placeholder="Enter amount"
                specialClass={`input__first ${config.isMaxBtn ? "input__amount" : ''}`}
                isNumberReading={true}
                btn={config.isMaxBtn ? {
                    "specialClass": "button__max",
                    "text": "Max",
                    "clickFunc": async e => {
                        e.preventDefault();
                        if (userAddress) {
                            const balance = await contractService.balanceOf(userAddress);
                            setAmount(balance.toString());
                        }
                    },
                    "disabled": !userAddress
                } : null}
                blur={async () => {
                    if (amount < minAmount && amount) {
                        addNote("The entered value is less than the minimum amount");
                    }
                    userAddress && contractService.balanceOf(userAddress).then(balance => {
                        if (amount > balance) {
                            addNote("Insufficient funds");
                        }
                    });
                }}
                isValid={isAmountValid}/>
            <div className='form-info'>
                <span className='form-info__fee'>
                    Fee: {isPendingFee ? <ClipLoader
                        size={12} color={variables.mainColor} css={css`margin-bottom: -2px;`}
                    /> : fee}%
                </span>
                <span className='form-info__min'>Minimum amount: {isPendingAmount ? <ClipLoader
                    size={12} color={variables.mainColor} css={css`margin: 0 4px -2px 0;`}
                /> : minAmount } {config.tokenName}
                </span>
            </div>

            <LabelLink text="You will receive"
                linkText={config?.tokenLinks[networkTo?.key][configBack?.netType]?.symbol}
                link={`${config?.tokenLinks[networkTo?.key][configBack?.netType]?.link}token/${addressTo}`}
            />
            <Input
                value={receive}
                setFunction={setReceive}
                placeholder="Receive amount"
                disabled={ true }
                isNumberReading={true}/>

            { config.isDestinationAddress ?
                (<>
                    <Label text="Destination address" />
                    <Input value={destination}
                        setFunction={setDestination}
                        placeholder="Enter address"
                        specialClass="input__last"
                        isValid={isDestinationValid}/>
                </>) : <Note/>}

            {/* buttons */}
            <Button text={"Connect wallet"}
                arrow="arrow_right.svg"
                specialClass={isWalletValid ? `button_hidden` : ""}
                clickFunc={e => {
                    e.preventDefault();
                    toggleChooseWalletModal();
                }}
                disabled={!!userAddress}
            />
            { !config.isOldFashined ?
                <div className={`form__buttons${!isWalletValid ? " button_hidden" : ""}`}>
                    <Button text={!approving ? "Allow the bridge to use your tokens" : "Waiting..."}
                        arrow="arrow_right.svg"
                        specialClass={`button__approve`}
                        clickFunc={e => {
                            e.preventDefault();
                            !approving ? transactionService.approve(userAddress) : () => { };
                        } }
                        disabled={!isAmountValid || approved} />
                    <Button text={!waiting ? "Swap" : "Waiting..."}
                        specialClass={``}
                        arrow="arrow_right.svg"
                        clickFunc={async e => {
                            e.preventDefault();
                            if (!waiting) {
                                console.log(await contractService.balanceOfTo(), amount);
                                const balance = await contractService.balanceOfTo();
                                if (balance + +amount > 9000000) {
                                    toggleAlertModal(
                                        {
                                            isOpen: true,
                                            text: (<div className="modal-alert__text">
                                                BOT bridge may be overcrowded please contact support
                                            </div>),
                                        });
                                } else {
                                    transactionService.handleSwap();
                                }
                            }
                        } }
                        disabled={!approved || !isValidForm} />
                </div> :
                <div className={`form__buttons_old${!isWalletValid ? " button_hidden" : ""}`}>
                    <Button text={!approving ? "Approve" : "Waiting..."}
                        specialClass={`button__approve button_old`}
                        clickFunc={e => {
                            e.preventDefault();
                            !approving ? transactionService.approve(userAddress) : () => { };
                        } }
                        disabled={!isAmountValid || approved} />
                    <ArrowIcon className="button__arrow_old" alt="arrow" />
                    <Button text={!waiting ? "Swap" : "Waiting..."}
                        specialClass={`button_old`}
                        clickFunc={e => {
                            e.preventDefault();
                            if (!waiting) {
                                transactionService.handleSwap();
                            }
                        } }
                        disabled={!approved || !isValidForm} />
                </div>
            }
        </form>);
};
export default Form;
