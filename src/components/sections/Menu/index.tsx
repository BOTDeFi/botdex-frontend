import React from 'react';
import nextId from 'react-id-generator';
import { NavLink } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import DaoImg from '@/assets/img/icons/dao.svg';
import LogoImg from '@/assets/img/icons/logo-new.svg';
import { useWalletConnectorContext } from '@/services/MetamaskConnect';
import { useMst } from '@/store';

import CollectiblesImg from '../../../assets/img/icons/collectibles.svg';
import TradeImg from '../../../assets/img/icons/exchange.svg';
import FarmsImg from '../../../assets/img/icons/farms-new.svg';
import HomeImg from '../../../assets/img/icons/home-new.svg';
import LogoMiniImg from '../../../assets/img/icons/logo-m-new.svg';
import LotteryImg from '../../../assets/img/icons/lottery.svg';
import PoolsImg from '../../../assets/img/icons/staking.svg';
import TeamsImg from '../../../assets/img/icons/teams.svg';
import { ReactComponent as TgImg } from '../../../assets/img/icons/tg-new.svg';
import { ReactComponent as TwImg } from '../../../assets/img/icons/tw-new.svg';
import { Button } from '../../atoms';
import { WalletModal } from '..';

import './Menu.scss';

interface IMenuProps {
  onClick?: () => void;
}

const Menu: React.FC<IMenuProps> = observer(({ onClick }) => {
  const { connect } = useWalletConnectorContext();
  const { user } = useMst();
  const navItems = [
    {
      text: 'Home',
      link: '/',
      img: HomeImg,
    },
    {
      text: 'Exchange',
      link: '/trade/swap',
      activePaths: [
        '/trade/swap',
        '/trade/liquidity',
        '/trade/liquidity/settings',
        '/trade/liquidity/history',
        '/trade/liquidity/find',
        '/trade/liquidity/add',
        '/trade/liquidity/remove',
        '/trade/liquidity/receive',
        '/trade/bridge',
        '/trade/swap/settings',
        '/trade/swap/history',
      ],
      img: TradeImg,
    },
    {
      text: 'Farms',
      link: '/farms',
      img: FarmsImg,
    },
    {
      text: 'Lottery',
      link: '/lottery',
      img: LotteryImg,
    },
    {
      text: 'Staking',
      link: '/pools',
      img: PoolsImg,
    },
    {
      text: 'Collectibles',
      link: '/collectibles',
      img: CollectiblesImg,
    },
    {
      text: 'Teams & Profile',
      link: '/teams',
      img: TeamsImg,
    },
    {
      text: 'DAO',
      link: '/dao',
      img: DaoImg,
    },
  ];

  const [isWalletModalVisible, setWalletModalVisible] = React.useState<boolean>(false);

  return (
    <>
      <div className="menu box-f-fd-c">
        <div className="menu__header">
          <img src={LogoImg} alt="BOTDEX logo" className="menu__header__logo" />
          <div className="menu__header__title">BOTDEX</div>
        </div>
        <div className="menu__nav">
          {navItems.map((item) => (
            <NavLink
              exact
              to={item.link}
              className="menu__nav-item"
              key={nextId()}
              onClick={onClick}
              isActive={(_, location) => {
                if (
                  (item.activePaths && item.activePaths.includes(location.pathname)) ||
                  (item.link !== '/' && location.pathname.indexOf(item.link) > -1)
                ) {
                  return true;
                }
                return item.link === location.pathname;
              }}
            >
              <div className="menu__nav-item-box box-f-ai-c">
                <div className="menu__nav-item-img box-f-c">
                  <img src={item.img} alt="" />
                </div>
                <span className="text-white">{item.text}</span>
              </div>
            </NavLink>
          ))}
        </div>
        <div className="menu__connect-box">
          {!user.address ? (
            <Button className="menu__connect" size="md" onClick={connect}>
              <span className="text-bold text-white">Connect Wallet</span>
            </Button>
          ) : (
            <Button className="menu__connect" size="md" onClick={() => setWalletModalVisible(true)}>
              <span className="text-white">
                {`${user.address.substr(0, 6)}...${user.address.substr(user.address.length - 5)}`}
              </span>
            </Button>
          )}
        </div>
        <div className="menu__balance box-gradient box-f-ai-c">
          <img src={LogoMiniImg} alt="BOTDEX logo" className="menu__balance-img" />
          <span className="text-white">$37.166</span>
        </div>
        <div className="menu__socials box-f-ai-c">
          <a href="/" className="menu__socials-item menu__socials-item-tg box-f-c">
            <TgImg />
          </a>
          <a href="/" className="menu__socials-item box-f-c">
            <TwImg />
          </a>
        </div>
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

export default Menu;
