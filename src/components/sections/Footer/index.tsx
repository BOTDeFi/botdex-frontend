import React from 'react';

import { ReactComponent as Bsc } from '@/assets/img/icons/bsc.svg';
import { Logo, TgWhite, TgBlue, TwWhite, TwBlue, DsWhite, DsBlue, InstWhite, InstBlue, GitWhite, GitBlue, MdWhite, MdBlue, InWhite, InBlue, BitWhite, BitBlue, FbWhite, FbBlue, RedWhite, RedBlue, YtWhite, YtBlue } from '@/assets/img/sections';

// import { Button, Input } from '@/components/atoms';
// import BotBlock from './BotBlock';
import { links } from './mock';

import s from './Footer.module.scss';

const Footer: React.FC = () => {
  // const [email, setEmail] = useState('');

  // const handleChangeEmail = (event: ChangeEvent<HTMLInputElement>) => {
  //   const { value } = event.target;
  //   setEmail(value);
  // };
  return (
    <div className={s.footer_wrapper}>
      <div className={s.footer}>
        <div className={s.logo}>
          <img src={Logo} alt="logo" />
          {/* <LogoFooter className={s.desktop} />
          <LogoTextFooter className={s.desktop} /> */}
          {/* <LogoFooterSm className={s.mobile} />
          <LogoTextFooterSm className={s.mobile} /> */}
        </div>
        <div className={s.links}>
          {links.map((linkBlock, index) => (
            <div key={linkBlock[index].name} className={s.link_block}>
              {linkBlock.map((link) => (
                <a
                  key={link.name}
                  href={link.path}
                  className={s.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  {link.name}
                </a>
              ))}
            </div>
          ))}
        </div>
        <div className={s.join_wrapper}>
          {/* <div className={s.join_left}>
            <div className={s.title}>Sign up for Bot Planet newsletter</div>
            <div className={s.subtitle}>
              Join the BOT Planet community and be at the forefront of all updates!
            </div>
            <div className={s.controls}>
              <Input
                value={email}
                onChange={handleChangeEmail}
                className={s.input}
                placeholder="Enter your Email"
              />
              <Button colorScheme="blue" className={s.joinBtn}>
                Join Us
              </Button>
            </div>
          </div> */}
          <div className={s.join_right}>
            <div className={s.title}>Join our community</div>
            <div className={s.subtitle}>We will keep you posted!</div>
            <div className={s.socials}>
              <a href="https://t.me/botplanetnews" target="_blank" rel="noreferrer">
                <img src={TgWhite} alt="icon" />
                <img src={TgBlue} alt="icon" />
              </a>
              <a href="https://twitter.com/BotPlanet_" target="_blank" rel="noreferrer">
                <img src={TwWhite} alt="icon" />
                <img src={TwBlue} alt="icon" />
              </a>
              <a href="https://discord.com/invite/Fzt2MjghYh" target="_blank" rel="noreferrer">
                <img src={DsWhite} alt="icon" />
                <img src={DsBlue} alt="icon" />
              </a>
              <a href="https://www.instagram.com/bot.planet/" target="_blank" rel="noreferrer">
                <img src={InstWhite} alt="icon" />
                <img src={InstBlue} alt="icon" />
              </a>
              <a href="https://github.com/BOTDeFi" target="_blank" rel="noreferrer">
                <img src={GitWhite} alt="icon" />
                <img src={GitBlue} alt="icon" />
              </a>
              <a href="https://botplanet.medium.com/" target="_blank" rel="noreferrer">
                <img src={MdWhite} alt="icon" />
                <img src={MdBlue} alt="icon" />
              </a>
              <a
                href="https://www.linkedin.com/company/botplanetltd"
                target="_blank"
                rel="noreferrer"
                className={s.smaller}
              >
                <img src={InWhite} alt="icon" />
                <img src={InBlue} alt="icon" />
              </a>
              <a
                href="https://bitcointalk.org/index.php?topic=5357949.msg57845384#msg57845384"
                target="_blank"
                rel="noreferrer"
                className={s.smaller}
              >
                <img src={BitWhite} alt="icon" />
                <img src={BitBlue} alt="icon" />
              </a>
              <a
                href="https://www.facebook.com/BotDefi"
                target="_blank"
                rel="noreferrer"
                className={s.smaller}
              >
                <img src={FbWhite} alt="icon" />
                <img src={FbBlue} alt="icon" />
              </a>
              <a
                href="https://www.reddit.com/r/Bot_Planet_Ecosystem/"
                target="_blank"
                rel="noreferrer"
              >
                <img src={RedWhite} alt="icon" />
                <img src={RedBlue} alt="icon" />
              </a>
              <a
                href="https://www.youtube.com/channel/UClMahaW1s5jyH31LT3XuFbQ"
                target="_blank"
                rel="noreferrer"
              >
                <img src={YtWhite} alt="icon" />
                <img src={YtBlue} alt="icon" />
              </a>
            </div>
          </div>
        </div>
        <a
          href="https://bscscan.com/address/0x1ab7e7deda201e5ea820f6c02c65fce7ec6bed32#code"
          target="_blank"
          rel="noreferrer"
        >
          <Bsc />
        </a>
        <div className={s.policies}>
          <a
            href="https://www.botpla.net/wp-content/uploads/2022/02/bot_planet_privacy_policy.pdf"
            className={s.link}
            target="_blank"
            rel="noreferrer"
          >
            Privacy Policy
          </a>
          <a
            href="https://www.botpla.net/wp-content/uploads/2022/02/Botplanet_Terms_of_Services.pdf"
            className={s.link}
            target="_blank"
            rel="noreferrer"
          >
            Terms&Conditions
          </a>
        </div>
        <div className={s.copyright}>© 2022 Bot Planet. All rights reserved</div>
      </div>
      <div className={s.bg} />
      {/* <div className={s.buyBlock}>
        <BotBlock />
      </div> */}
    </div>
  );
};

export default Footer;
