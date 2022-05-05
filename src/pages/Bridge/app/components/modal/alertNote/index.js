import React from "react";
import { useSelector, useDispatch } from 'react-redux';

import '../style.scss';
import { modalActions } from "../../../redux/index";
import { ReactComponent as IconClose } from "../../../assets/images/close.svg";

const AlertModal = () => {
    const { isOpen, text } = useSelector(({ modal }) => ({
        isOpen: modal.isOpen,
        text: modal.text,
    }));

    const dispatch = useDispatch();

    const ref = React.useRef();

    const handleClose = () => dispatch(modalActions.toggleAlertModal({ isOpen: false, text: null }));

    const handleClickOutside = e => {
        if (e.target === ref.current)
            dispatch(modalActions.toggleAlertModal({ isOpen: false, text: '' }));
    };

    React.useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    return (
        <div className={`modal__overlay ${isOpen ? " modal__overlay_oppened" : " modal__overlay_closed"}`} ref={ ref }>
            <div className="modal">
                <div className="modal__wrapper">
                    <IconClose
                        onClick={handleClose}
                        className="modal__close"
                    />
                    { text }
                </div>
            </div>
        </div>
    );
};

export default AlertModal;
