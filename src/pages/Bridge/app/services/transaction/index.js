import React from 'react';
import Button from '../../components/button';

import { store } from '../../redux/store';
import { transactionActions } from '../../redux';
import { progressActions } from '../../redux';
import { toggleAlertModal } from '../../redux/actions-creators/modalActions';
import backendService from '../backend';

const setAmount = value => {
    store.dispatch(transactionActions.setAmount(value));
};

const setApproved = value => {
    store.dispatch(transactionActions.setApproved(value));
};

const setApproving = value => {
    store.dispatch(transactionActions.setApproving(value));
};

const setWaiting = value => {
    store.dispatch(transactionActions.setWaiting(value));
};

const state = store.getState();

class TransactionService {
    constructor() {
        this.userAddress = state.user.address;
        this.isValidForm = state.formData.isValidForm;
        this.networkTo = state.transaction.networkTo;
        this.networkFrom = state.transaction.networkFrom;
        this.amount = state.transaction.amount;
        this.contractService = state.transaction.contractService;
        store.subscribe(() => {
            const state = store.getState();
            this.contractService = state.transaction.contractService;
            this.userAddress = state.user.address;
            this.isValidForm = state.formData.isValidForm;
            this.networkTo = state.transaction.networkTo;
            this.networkFrom = state.transaction.networkFrom;
            this.amount = state.transaction.amount;
        });
    }
    async checkAllowance(intervalCheckAllowance) {
        try {
            console.log(store.getState().user.address);
            const balance = await this.contractService.balanceOf(this.userAddress);
            console.log("balanceOf", balance);
            const allowance = await this.contractService.allowance(this.userAddress);
            console.log("allowance", allowance);
            if (!intervalCheckAllowance) setApproving(false);
            if (allowance > 0 && this.amount <= allowance) {
                setApproved(true);
                clearInterval(intervalCheckAllowance);
                return true;
            } else {
                setApproved(false);
                setApproving(false);
                clearInterval(intervalCheckAllowance);
            }
            return false;
        } catch (e) {
            clearInterval(intervalCheckAllowance);
            console.error(e);
        }
    }

    async approve(userAddress) {
        try {
            if (!store.getState().formData.isAmountValid) return;
            setApproving(true);
            await this.contractService.approveToken(userAddress, async res => {
                console.log('approveToken', res);
                if (res && res.status === 'ERROR') return setApproving(false);
                const intervalCheckAllowance = setInterval(async () => {
                    await this.checkAllowance(intervalCheckAllowance);
                }, 500);
            });
        } catch (e) {
            console.error(e);
        }
    }

    cancelSwap() { store.dispatch(toggleAlertModal({ isOpen: false, text: null })); }

    async checkGas(swap) {
        try {
            const resultGetGas = await backendService.getGasPriceLimit({ network: this.networkTo });
            console.log("checkGas resultGetGas", resultGetGas);
            const resultGetDex = await backendService
                .getDex();
            const currentGetGas = resultGetDex.tokens.filter(item => item.network === this.networkTo.key)[0].gas_price;
            console.log("checkGas currentGetGas", currentGetGas);
            const isOk = currentGetGas <= resultGetGas;
            console.log(
                "currentGetGas, resultGetGas, status",
                currentGetGas,
                "<=",
                resultGetGas,
                isOk
            );
            if (resultGetGas && currentGetGas && !isOk) {
                store.dispatch(toggleAlertModal({
                    isOpen: true,
                    text: (
                        <div>
                            <div className="modal-alert__text">
                                <p>
                                    Gas price in the {this.networkTo.key.split("-").join(" ")} network is
                                    too high.
                                </p>
                                <p>The swap can take longer than usual.</p>
                            </div>
                            <div className="modal-alert__buttons">
                                <Button clickFunc={this.cancelSwap} text="Close" specialClass='button-modal' />
                                <Button clickFunc={swap} text="Proceed" specialClass='button-modal' />
                            </div>
                        </div>
                    ),
                }));
                return false;
            } else {
                return true;
            }
        } catch (e) {
            console.error(e);
        }
    }

    async swap() {
        console.log(this);
        try {
            store.dispatch(toggleAlertModal({ isOpen: false, text: null }));
            if (!this.isValidForm) return;
            setWaiting(true);
            const blockchain = this.networkTo.id;
            // networks && networks.filter(item => item.key === networkTo)[0].id;
            console.log(this.userAddress, blockchain, this.amount);
            await this.contractService.transferToOtherBlockchain({
                userAddress: this.userAddress,
                blockchain,
                amount: this.amount,
                receiver: this.userAddress,
                callback: async res => {
                    console.log("transferToOtherBlockchain", res);
                    if (res.status === "SUCCESS") {
                        setAmount('');
                        store.dispatch(progressActions.setStepDone(3, true));
                        store.dispatch(progressActions.setStepDone(4, true));
                    }
                    setWaiting(false);
                },
            });
        } catch (e) {
            console.error(e);
        }
    }

    async handleSwap() {
        try {
            const isGasOk = await this.checkGas(this.swap.bind(this));
            if (isGasOk) this.swap();
        } catch (e) {
            console.error(e);
        }
    }
}
export default TransactionService;
