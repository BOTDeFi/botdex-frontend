/* eslint-disable no-undef */
import React from 'react';
import "./style.scss";

import { ReactComponent as ArrowIcon } from '../../assets/images/arrow_right.svg';

const Button = ({ text, arrow = null, specialClass = "", clickFunc, disabled = false }) => (
    <button className={`button ${specialClass} ${disabled ? ' button_inactive' : ''}`}
        onClick={ clickFunc }
        disabled={disabled}>
        {arrow ? <ArrowIcon className="button__arrow" alt="arrow" /> : null}
        <span>{text}</span>
    </button>
);
export default Button;
