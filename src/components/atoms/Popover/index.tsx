import React from 'react';
import { Popover as AntdPopover, PopoverProps } from 'antd';

import 'antd/lib/popover/style/css';

import './Popover.scss';

const Popover: React.FC<PopoverProps> = (props) => {
  return (
    <AntdPopover placement="bottom" className="popover" {...props}>
      {props.children}
    </AntdPopover>
  );
};

export default Popover;
