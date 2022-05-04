import React from 'react';
import './style.scss';

import { ReactComponent as InfoIcon }  from '../../../assets/images/popup_note_icon.svg';

const NotePopup = ({ text, togglePopup }) => {
    const [isPopupOpened, setPopupOpened] = React.useState(true);

    const handleHide = () => {
        setPopupOpened(false);
        setTimeout(togglePopup, 1000);
    };

    React.useEffect(() => {
        const timerId = setTimeout(() => {
            handleHide();
        }, 12000);
        return () => {
            clearTimeout(timerId);
        };
    }, []);

    return (
        <div className={`popup${isPopupOpened ? ' popup_oppened' : ' popup_closed'}`}>
            <div className="popup__wrapper">
                <InfoIcon className="popup__icon" alt="info" />
                <p className="popup__text">{text}</p>
                <button className="popup__close" onClick={() => {
                    handleHide();
                }}>
                    <span>&#10006;</span>
                </button>
            </div>
        </div>);
};
export default NotePopup;
