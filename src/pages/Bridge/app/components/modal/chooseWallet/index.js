import React from 'react';
import Button from '../../button';
import { useSelector, useDispatch } from 'react-redux';
import { bindActionCreators } from '@reduxjs/toolkit';
import { modalActions, /*formDataActions, progressActions,*/ walletActions } from '../../../redux';

const ChooseWalletModal = () => {
    const dispatch = useDispatch();
    const modal = useSelector(state => state.modal);
    const { toggleChooseWalletModal } = bindActionCreators(modalActions, dispatch);
    // const { setValidationWallet } = bindActionCreators(formDataActions, dispatch);
    // const { setStepDone } = bindActionCreators(progressActions, dispatch);
    const setWalletType = data => dispatch(walletActions.default.setWalletType(data));

    return (
        <div className={`modal__overlay${modal.isWalletModalOpen ?
            " modal__overlay_oppened" :
            " modal__overlay_closed"}`}
        onClick={e =>
            (e.target.classList.contains("modal__overlay") ?
                toggleChooseWalletModal() :
                null)}>
            <div className='modal'>
                <div className="modal__wrapper">
                    <h3 className="modal__title">Please choose wallet</h3>
                    <Button
                        specialClass='modal__btn'
                        text={"Metamask"}
                        clickFunc={() => {
                            setWalletType("metamask");
                            toggleChooseWalletModal();
                        }}/>
                    <Button
                        specialClass='modal__btn'
                        text={"Binance wallet"}
                        clickFunc={() => {
                            setWalletType("binance");
                            toggleChooseWalletModal();
                        }}/>
                </div>
            </div>
        </div>
    );
};
export default ChooseWalletModal;
