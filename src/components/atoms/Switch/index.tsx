import React from 'react';
import { Switch as AntdSwitch } from 'antd';
import { SwitchProps } from 'antd/lib/switch';
import cn from 'classnames';

import 'antd/lib/switch/style/css';

import './Switch.scss';

interface ISwitch extends SwitchProps {
  colorScheme?: 'white' | 'purple' | 'white-purple';
  switchSize?: 'bg' | 'sm';
  text?: string | React.ReactElement;
  value?: boolean;
}

const Switch: React.FC<ISwitch> = React.memo((props) => {
  const { colorScheme, switchSize, text, value, ...otherProps } = props;
  return (
    <div className="box-f-ai-c">
      <AntdSwitch
        checked={value}
        className={cn(
          'switch',
          `${colorScheme ? `switch-${colorScheme}` : ''}`,
          `${switchSize ? `switch-${switchSize}` : ''}`,
        )}
        {...otherProps}
      />
      {text}
    </div>
  );
});

export default Switch;
