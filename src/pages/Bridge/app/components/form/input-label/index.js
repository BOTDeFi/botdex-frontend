import React from 'react';
import './style.scss';

const Label = ({ text, additional = "", additionalImg = "" }) => (
    <label className='input-label'>
        <span className='input-label__text'>{text}</span>
        {additional ? (<span className='input-label__additional'>
            { additional }
            { additionalImg ? <img className='input-label__icon' src={ additionalImg } alt="label-img" /> : null }
        </span>) : null
        }
    </label>
);
export default Label;
