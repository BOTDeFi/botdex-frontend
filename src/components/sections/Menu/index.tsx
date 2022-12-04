import React from 'react';
import nextId from 'react-id-generator';
import { NavLink } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import cn from 'classnames';
import { observer } from 'mobx-react-lite';

import ArrowImg from '@/assets/img/icons/arrow-dropdown.svg';
import BridgeImg from '@/assets/img/icons/bridge.svg';
import FarmsImg from '@/assets/img/icons/farms.svg';
import GamefiImg from '@/assets/img/icons/gamefi.svg';
import HomeImg from '@/assets/img/icons/home.svg';
import LiquidityImg from '@/assets/img/icons/liquidity.svg';
// import { ReactComponent as LogoText } from '@/assets/img/icons/logo_text.svg';
// import { ReactComponent as Logo } from '@/assets/img/icons/logo.svg';
// import { ReactComponent as Logo } from '@/assets/img/icons/logo_sm.svg';
import LotteryImg from '@/assets/img/icons/lottery_menu.svg';
import MarketplaceImg from '@/assets/img/icons/marketplace.svg';
import MessengerImg from '@/assets/img/icons/messenger.svg';
import MoreImg from '@/assets/img/icons/more.svg';
import PoolsImg from '@/assets/img/icons/pools.svg';
import TradeImg from '@/assets/img/icons/trade.svg';
import WalletMenuImg from '@/assets/img/icons/wallet_menu.svg';
// import { ReactComponent as WalletImg } from '@/assets/img/icons/wallet.svg';
// import { Button } from '@/components/atoms';
import { WalletModal } from '@/components/sections';
// import { useWalletConnectorContext } from '@/services/MetamaskConnect';
import { useMst } from '@/store';

// import { addressWithDots } from '@/utils/formatters';
import './Menu.scss';
import { LogoHeaderMin, Logo } from '@/assets/img/sections';

interface IMenuProps {
  onClick?: () => void;
}

const Menu: React.FC<IMenuProps> = observer(({ onClick }) => {
  // const { connect } = useWalletConnectorContext();
  const { user } = useMst();
  const navItems = [
    {
      text: 'Home',
      link: '/',
      img: HomeImg,
    },
    {
      text: 'Swap',
      link: '/trade/swap',
      activePaths: ['/trade/swap', '/trade/swap/settings', '/trade/swap/history'],
      img: TradeImg,
    },
    {
      text: 'Liquidity',
      link: '/trade/liquidity',
      activePaths: [
        '/trade/liquidity',
        '/trade/liquidity/settings',
        '/trade/liquidity/history',
        '/trade/liquidity/find',
        '/trade/liquidity/add',
        '/trade/liquidity/remove',
        '/trade/liquidity/receive',
      ],
      img: LiquidityImg,
    },
    {
      text: 'Farming',
      link: '/farms',
      img: FarmsImg,
    },
    {
      text: 'Staking V2',
      link: '/staking',
      img: PoolsImg,
    },
    {
      text: 'Staking V1',
      link: '/oldstaking',
      img: PoolsImg,
    },
    {
      text: 'Bridge',
      // link: '/trade/bridge',
      link: '/coming-soon/bridge',
      img: BridgeImg,
    },
    {
      text: 'Wallet',
      link: '/coming-soon/wallet',
      img: WalletMenuImg,
    },
    {
      text: 'Marketplace',
      link: '/coming-soon/marketplace',
      img: MarketplaceImg,
    },
    {
      text: 'Gamefi',
      link: '/coming-soon/gamefi',
      img: GamefiImg,
    },
    {
      text: 'Lottery',
      link: '/coming-soon/lottery',
      img: LotteryImg,
    },
    {
      text: 'Messenger',
      link: '/coming-soon/messenger',
      img: MessengerImg,
    },
    // {
    //   text: 'Collectibles',
    //   link: '/collectibles',
    //   img: CollectiblesImg,
    // },
    // {
    //   text: 'Teams & Profile',
    //   link: '/teams',
    //   img: TeamsImg,
    // },
    // {
    //   text: 'DAO',
    //   link: '/dao',
    //   img: DaoImg,
    // },
  ];

  const [isOpenShowMore, setOpenShowMore] = React.useState<boolean>(false);
  const [isWalletModalVisible, setWalletModalVisible] = React.useState<boolean>(false);

  const handleOpenShowMore = React.useCallback(() => {
    setOpenShowMore(!isOpenShowMore);
  }, [isOpenShowMore]);

  return (
    <>
      <div className="menu box-f-fd-c">
        <div className="menu__header">
          <img src={LogoHeaderMin} alt="" />
          <img src={Logo} alt="" />
          {/* <Logo /> */}

          {/* <LogoText /> */}
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
                <span>{item.text}</span>
                {item.link.split('/')[1] === 'coming-soon' && (
                  <div className="menu__nav-item-box__soon">Soon</div>
                )}
              </div>
            </NavLink>
          ))}
          <div
            onKeyDown={() => { }}
            role="button"
            tabIndex={0}
            className="menu__nav-item"
            onClick={handleOpenShowMore}
          >
            <div className={cn('menu__nav-item-box box-f-ai-c', isOpenShowMore && 'active')}>
              <div className="menu__nav-item-img box-f-c">
                <img src={MoreImg} alt="" />
              </div>
              <span>More</span>
              <div className={cn('menu__nav-item-arrow', isOpenShowMore && 'active')}>
                <img src={ArrowImg} alt="" />
              </div>
            </div>
          </div>
          <CSSTransition
            unmountOnExit
            mountOnEnter
            in={isOpenShowMore}
            addEndListener={(node, done) => {
              node.addEventListener('transitionend', done, false);
            }}
            classNames="show"
          >
            <div className="show-more-wrapper">
              <a href="https://www.certik.com/projects/bot-planet" target="_blank" rel="noreferrer">
                Audit CertiK
              </a>
              <a href="https://hacken.io/audits/#bot_planet" target="_blank" rel="noreferrer">
                Audit Hacken
              </a>
              <a href="https://www.botpla.net/#aboutus" target="_blank" rel="noreferrer">
                About $BOT
              </a>
              <a href="https://www.botpla.net/#team" target="_blank" rel="noreferrer">
                Team
              </a>
              <a
                href="https://www.botpla.net/wp-content/uploads/2022/02/White-Paper.pdf"
                target="_blank"
                rel="noreferrer"
              >
                Whitepaper
              </a>
              <a
                href="https://www.botpla.net/wp-content/uploads/2022/02/Deck.pdf"
                target="_blank"
                rel="noreferrer"
              >
                Deck
              </a>
              <a href="https://www.botpla.net/#team" target="_blank" rel="noreferrer">
                Partners
              </a>
              <a href="https://www.botpla.net/blog" target="_blank" rel="noreferrer">
                Blog
              </a>
            </div>
          </CSSTransition>
        </div>
        {/* <div className="menu__socials box-f-ai-c"> */}
        {/*  <a href="/" className="menu__socials-item menu__socials-item-tg box-f-c"> */}
        {/*    <TgImg /> */}
        {/*  </a> */}
        {/*  <a href="/" className="menu__socials-item box-f-c"> */}
        {/*    <TwImg /> */}
        {/*  </a> */}
        {/* </div> */}
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
