import React from 'react';

import { ReactComponent as Bsc } from '@/assets/img/icons/bsc.svg';
import { ReactComponent as Discord } from '@/assets/img/icons/discord.svg';
import { ReactComponent as Github } from '@/assets/img/icons/github.svg';
import { ReactComponent as Insta } from '@/assets/img/icons/insta.svg';
import { ReactComponent as Tg } from '@/assets/img/icons/tg.svg';
import { ReactComponent as Twitter } from '@/assets/img/icons/twitter.svg';
import { BitTalk, LinkedIn, Logo, Medium } from '@/assets/img/sections';

// import { Button, Input } from '@/components/atoms';
// import BotBlock from './BotBlock';
import { links } from './mock';

import s from './Footer.module.scss';

const Footer: React.FC  = () => {
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
                <Tg />
              </a>
              <a href="https://twitter.com/BotPlanet_" target="_blank" rel="noreferrer">
                <Twitter />
              </a>
              <a href="https://discord.com/invite/Fzt2MjghYh" target="_blank" rel="noreferrer">
                <Discord />
              </a>
              <a href="https://www.instagram.com/bot.planet/" target="_blank" rel="noreferrer">
                <Insta />
              </a>
              <a href="https://github.com/BOTDeFi" target="_blank" rel="noreferrer">
                <Github />
              </a>
              <a href="https://botplanet.medium.com/" target="_blank" rel="noreferrer">
                <img src={Medium} alt="icon" />
              </a>
              <a
                href="https://www.linkedin.com/company/botplanetltd"
                target="_blank"
                rel="noreferrer"
              >
                <img src={LinkedIn} alt="icon" />
              </a>
              <a
                href="https://bitcointalk.org/index.php?topic=5357949.msg57845384#msg57845384"
                target="_blank"
                rel="noreferrer"
              >
                <img src={BitTalk} alt="icon" />
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
