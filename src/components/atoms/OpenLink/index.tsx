import React from 'react';
import classNames from 'classnames';

import OpenLinkImg from '@/assets/img/icons/open-link.svg';

interface IOpenLinkProps {
  // eslint-disable-next-line react/require-default-props
  className?: string;
  // eslint-disable-next-line react/require-default-props
  href?: string;
  text: string | JSX.Element;
  // eslint-disable-next-line react/require-default-props
  iconClassName?: string;
  // eslint-disable-next-line react/require-default-props
  icon?: boolean;
}

const OpenLink: React.FC<IOpenLinkProps> = ({
  className,
  href,
  text,
  iconClassName,
  icon = true,
}) => {
  return (
    <a
      href={href}
      className={classNames(className, 'box-f-ai-c text-black text-ssm')}
      target="_blank"
      rel="noreferrer"
    >
      {React.isValidElement(text) ? text : <span>{text}</span>}
      {icon && <img className={iconClassName} src={OpenLinkImg} alt="" />}
    </a>
  );
};

export default OpenLink;
