import React from 'react';
import classNames from 'classnames';

import OpenLinkImg from '@/assets/img/icons/open-link.svg';

interface IOpenLinkProps {
  // eslint-disable-next-line react/require-default-props
  href?: string;
  // eslint-disable-next-line react/require-default-props
  className?: string;
  text: string;
}

const OpenLink: React.FC<IOpenLinkProps> = ({ className, href, text }) => {
  return (
    <a href={href} className={classNames(className, 'box-f-ai-c text-black text-ssm')}>
      <span>{text}</span>
      <img src={OpenLinkImg} alt="" />
    </a>
  );
};

export default OpenLink;
