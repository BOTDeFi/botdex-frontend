import React from 'react';
import "./style.scss";
import { logoIMG } from '../../config/config_front';

const Header = () => (
    <div className='header'>
        <img src={logoIMG} className="header__img" />
    </div>
);
export default Header;
