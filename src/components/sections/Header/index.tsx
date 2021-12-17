import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

import Burger from '@/assets/img/icons/burger-white.svg';
import Close from '@/assets/img/icons/close-white.svg';
import logo from '@/assets/img/icons/logo-m-new.svg';

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
          {isBurger ? (
            <img src={Close} alt="close white icon" />
          ) : (
            <img src={Burger} alt="nav burger white" />
          )}
        </div>
        <div className="header__logo">
          <img src={logo} alt="logo" />
          <div className="header__logo__title">BOTDEX</div>
        </div>
      </section>
      <div className={`menu-mob ${isBurger && 'menu-mob--active'}`}>
        <Menu onClick={handleClose} />
      </div>
    </>
  );
});

export default Header;
