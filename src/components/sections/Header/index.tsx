import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';

import logo from '@/assets/img/icons/logo.png';
import { Button } from '@/components/atoms';
import { useWalletConnectorContext } from '@/services/MetamaskConnect';
import { useMst } from '@/store';

import { Menu, OutsideClick, WalletModal } from '../index';

import './Header.scss';

const Header: React.FC = observer(() => {
  const [isBurger, setIsBurger] = useState(false);
  const [isWalletModalVisible, setWalletModalVisible] = useState(false);
  const { user } = useMst();
  const { connect } = useWalletConnectorContext();
  const location = useLocation();

  const handleClose = () => {
    setIsBurger(false);
  };

  useEffect(() => {
    if (isBurger) {
      document.body.classList.add('hide-scroll');
    } else document.body.classList.remove('hide-scroll');
  }, [location, isBurger]);

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
        <div className="header__logo">
          <img src={logo} alt="logo" />
          <div className="header__logo__title">
            <span>BOT</span>Swap
          </div>
        </div>
      </section>
      {!user.address ? (
        <Button
          className={`connect ${location.pathname === ('/farms' && '/staking') && 'hide'}`}
          size="md"
          onClick={connect}
        >
          <span className="text-bold">Connect Wallet</span>
        </Button>
      ) : (
        <Button
          className={`connect ${location.pathname === ('/farms' && '/staking') && 'hide'}`}
          size="md"
          onClick={() => setWalletModalVisible(true)}
        >
          <span className="text-bold text-address">{user.address}</span>
        </Button>
      )}
      <OutsideClick onClick={handleClose}>
        <div className={`menu-mob ${isBurger && 'menu-mob--active'}`}>
          <Menu onClick={handleClose} />
        </div>
      </OutsideClick>
      {user.address ? (
        <WalletModal
          isVisible={isWalletModalVisible}
          handleClose={() => setWalletModalVisible(false)}
        />
      ) : (
        ''
      )}
    </>
  );
});

export default Header;
