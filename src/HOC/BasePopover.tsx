import React from 'react';

import InfoImg from '@/assets/img/icons/info.svg';
import { Popover } from '@/components/atoms';

export interface IBasePopover {
  className?: string;
  text: JSX.Element | string;
}

const BasePopover: React.FC<IBasePopover> = ({ className, text, ...props }) => {
  return (
    <Popover
      className={className}
      content={<div className="text-med text">{text}</div>}
      overlayInnerStyle={{ borderRadius: '12px' }}
      {...props}
    >
      <img src={InfoImg} style={{ marginBottom: 2 }} alt="" />
    </Popover>
  );
};

export default BasePopover;

export const withPopover = (text: JSX.Element | string) => {
  return (props: Omit<IBasePopover, 'text'>): JSX.Element => {
    return <BasePopover text={text} {...props} />;
  };
};
