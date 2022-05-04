/* eslint-disable no-undef */
import React from 'react';
import ArrowDown from '../../../../assets/images/arrow_down.svg';

import './style.scss';

const DropdownInput = ({ network, optionClass = "", onclick = () => {} }) => (
    <div className={`dropdown__input ${optionClass}`} onClick={ onclick }>
        <img src={require(`../../../../assets/images/${network.img}`).default } className="dropdown__icon" />
        <p className="dropdown__text">{network.name}</p>
        <img src={ArrowDown} className="dropdown__arrow" />
    </div>
);
export default DropdownInput;
