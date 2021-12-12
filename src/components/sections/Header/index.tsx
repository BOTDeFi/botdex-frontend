import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

import logo from '@/assets/img/icons/logo-header.svg';

import { Menu } from '../index';

import './Header.scss';

const Header: React.FC = React.memo(() => {
  const [isBurger, setIsBurger] = useState(false);

  const handleClose = () => {
    setIsBurger(false);
  };

  useEffect(() => {
    if (isBurger) {
      document.body.classList.add('hide-scroll');
    } else document.body.classList.remove('hide-scroll');
  }, [isBurger]);

  return (
    <>
      <section className="header">
        <div
          tabIndex={0}
          role="button"
          onKeyDown={() => {}}
          className={classNames('header-burger', { 'header-burger--active': isBurger })}
          onClick={() => setIsBurger(!isBurger)}
        >
          <div className="header-burger__line header-burger__line--1" />
          <div className="header-burger__line header-burger__line--2" />
          <div className="header-burger__line header-burger__line--3" />
        </div>
        <div className="header-logo">
          <img src={logo} alt="logo" />
        </div>
      </section>
      <div className={`menu-mob ${isBurger && 'menu-mob--active'}`}>
        <Menu onClick={handleClose} />
      </div>
    </>
  );
});

export default Header;
