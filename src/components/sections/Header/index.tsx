import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';

import logo from '@/assets/img/icons/logo-header.svg';
import { Button } from '@/components/atoms';
import { useWalletConnectorContext } from '@/services/MetamaskConnect';
import { useMst } from '@/store';

import { Menu, WalletModal } from '../index';

import './Header.scss';

const Header: React.FC = observer(() => {
  const [isBurger, setIsBurger] = useState(false);
  const [isWalletModalVisible, setWalletModalVisible] = useState(false);
  const { user } = useMst();
  const { connect } = useWalletConnectorContext();

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
      {!user.address ? (
        <Button className="connect" size="md" onClick={connect}>
          <span className="text-bold text-white">Connect Wallet</span>
        </Button>
      ) : (
        <Button className="connect" size="md" onClick={() => setWalletModalVisible(true)}>
          <span className="text-bold text-white text-address">{user.address}</span>
        </Button>
      )}
      <div className={`menu-mob ${isBurger && 'menu-mob--active'}`}>
        <Menu onClick={handleClose} />
      </div>
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
