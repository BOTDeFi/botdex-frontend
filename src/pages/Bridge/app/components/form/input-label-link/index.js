import React from 'react';
import '../input-label/style.scss';

import LinkIcon from '../../../assets/images/link_icon.svg';

const LabelLink = ({ text, link, linkText = "#" }) => (
    <label className='input-label'>
        <span className="input-label__text">{ text }</span>
        <a className='input-label__additional'
            href={link} target="_blank" rel="noreferrer">
            {linkText}
            <img className='input-label__icon' src={LinkIcon} alt="link" />
        </a>
    </label>
);
export default LabelLink;
