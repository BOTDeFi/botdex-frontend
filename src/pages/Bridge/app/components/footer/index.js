import React from 'react';

import './style.scss';

import { icons, copyright } from '../../config/config_front';

const Footer = () =>
    (
        <div className='footer'>
            <div className='footer__icons'>
                { icons.map((item, index) => (
                    <a className='footer__link' key={index} target='_blank' href={item.link} rel="noreferrer" >
                        <img className='footer__icon' src={item.icon} alt='icon'/>
                    </a>
                ))}
            </div>
            <div className='footer__copyright'>
                { copyright }
            </div>
        </div>
    )
;

export default Footer;
