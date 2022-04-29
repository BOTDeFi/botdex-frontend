import { VFC } from 'react';

import { Button } from '@/components/atoms';

import s from './CookiesWarn.module.scss';

interface ICookiesWarn {
  onAccept: () => void;
}

const CookiesWarn: VFC<ICookiesWarn> = ({ onAccept }) => {
  return (
    <div className={s.wrapper}>
      <div className={s.container}>
        <div className={s.container_content}>
          <span>
            We use cookies to ensure that we give you the best experience on our website. If you
            continue to use this site we will assume that you agree with it.
          </span>
          <ul>
            <li>
              <a
                href="https://www.botpla.net/wp-content/uploads/2022/02/bot_planet_privacy_policy.pdf"
                target="_blank"
                rel="noreferrer"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="https://www.botpla.net/wp-content/uploads/2022/02/Botplanet_Terms_of_Services.pdf"
                target="_blank"
                rel="noreferrer"
              >
                Terms&Conditions
              </a>
            </li>
          </ul>
        </div>
        <div className={s.container_btn}>
          <Button colorScheme="pink" size="smd" onClick={onAccept}>
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookiesWarn;
