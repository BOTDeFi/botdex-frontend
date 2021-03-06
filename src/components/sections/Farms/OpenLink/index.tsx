import React from 'react';
import classNames from 'classnames';

import OpenLinkImg from '@/assets/img/icons/open-link.svg';

interface IOpenLinkProps {
  className?: string;
  href?: string;
  text: string;
}

const OpenLink: React.FC<IOpenLinkProps> = ({ className, href, text }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={classNames(className, 'box-f-ai-c text-ssm')}
    >
      <span>{text}</span>
      <img src={OpenLinkImg} alt="" />
    </a>
  );
};

export default OpenLink;
