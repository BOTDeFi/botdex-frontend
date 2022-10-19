import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';

import { ReactComponent as CertikSmImg } from '@/assets/img/icons/certik_sm.svg';
import { ReactComponent as CertikImg } from '@/assets/img/icons/certik.svg';
import { ReactComponent as HackenSmImg } from '@/assets/img/icons/hacken_sm.svg';
import { ReactComponent as HackenImg } from '@/assets/img/icons/hacken.svg';
import { ReactComponent as LogoSm } from '@/assets/img/icons/logo_sm.svg';
import { ReactComponent as WalletImg } from '@/assets/img/icons/wallet.svg';
import { Button } from '@/components/atoms';
import { WalletModal } from '@/components/sections';
import Menu from '@/components/sections/Menu';
import { useWalletConnectorContext } from '@/services/MetamaskConnect';
import { useMst } from '@/store';
import { addressWithDots } from '@/utils/formatters';
import './Header.scss';

const Header: React.FC = observer(() => {
  const { pathname } = useLocation();
  const headerCondition = (pathname === '/farms' || pathname === '/staking' || pathname === '/oldstaking') && 'hide';

  const [isBurger, setIsBurger] = useState(false);
  const [isWalletModalVisible, setWalletModalVisible] = useState(false);
  const { user } = useMst();
  const { connect } = useWalletConnectorContext();
  const location = useLocation();

  const handleToggleSidebar = React.useCallback(() => {
    setIsBurger(!isBurger);
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [isBurger]);
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
          onKeyDown={() => { }}
          className={classNames('header-burger', { 'header-burger--active': isBurger })}
          onClick={handleToggleSidebar}
        >
          <div className="header-burger__line header-burger__line--1" />
          <div className="header-burger__line header-burger__line--2" />
          <div className="header-burger__line header-burger__line--3" />
        </div>
        <div className="header__logo">
          <LogoSm />
        </div>
        <div className="audits_sm">
          <a href="https://hacken.io/audits/#bot_planet" target="_blank" rel="noreferrer">
            <HackenSmImg />
          </a>
          <a href="https://www.certik.com/projects/bot-planet" target="_blank" rel="noreferrer">
            <CertikSmImg />
          </a>
        </div>
        {!user.address ? (
          <Button className="header__connect_btn" colorScheme="blue" size="sm" onClick={connect}>
            <span className="text-bold">Connect Wallet</span>
          </Button>
        ) : (
          <Button
            className="header__connect_btn"
            colorScheme="blue"
            size="sm"
            onClick={() => setWalletModalVisible(true)}
          >
            <span className="text-bold text-address">{addressWithDots(user.address)}</span>
          </Button>
        )}
      </section>
      <div className={`connect_wrapper ${headerCondition}`}>
        <div className="connect_container">
          <div className="audits">
            <a href="https://hacken.io/audits/#bot_planet" target="_blank" rel="noreferrer">
              <HackenImg />
            </a>
            <a href="https://www.certik.com/projects/bot-planet" target="_blank" rel="noreferrer">
              <CertikImg />
            </a>
          </div>
          {!user.address ? (
            <Button
              className={`connect btn-hover-down ${headerCondition}`}
              colorScheme="blue"
              size="sm"
              onClick={connect}
            >
              <WalletImg />
              <span className="text-500">Connect Wallet</span>
            </Button>
          ) : (
            <Button
              className={`connect btn-hover-down ${headerCondition}`}
              colorScheme="blue"
              size="sm"
              onClick={() => setWalletModalVisible(true)}
            >
              <WalletImg />
              <span className="text-bold text-address">{addressWithDots(user.address)}</span>
            </Button>
          )}
        </div>
      </div>
      <div className={`menu-mob ${isBurger && 'menu-mob--active'}`}>
        <div
          role="button"
          aria-label="Sidebar Cover"
          tabIndex={0}
          onKeyDown={() => { }}
          onClick={handleClose}
          className={classNames('sidebar_cover', { active: isBurger })}
        />
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
