import React from 'react';
import { Input as AntdInput } from 'antd';
import { InputProps } from 'antd/lib/input';
import cn from 'classnames';

import 'antd/lib/input/style/css';

import './Input.scss';

interface IInput extends InputProps {
  // eslint-disable-next-line react/no-unused-prop-types
  colorScheme?: 'transparent' | 'outline' | 'darkgray';
  // eslint-disable-next-line react/no-unused-prop-types
  inputSize?: 'sm' | 'md' | 'lg';
  // eslint-disable-next-line react/no-unused-prop-types
  ref?: any;
}

const Input: React.ForwardRefExoticComponent<IInput> = React.memo(
  React.forwardRef<typeof AntdInput, IInput>((props, ref) => {
    const { colorScheme = 'transparent', inputSize = 'sm', className, ...otherProps } = props;
    return (
      <AntdInput
        className={cn(
          'input',
          `${colorScheme ? `input-${colorScheme}` : ''}`,
          `${inputSize ? `input-${inputSize}` : ''}`,
          className,
        )}
        ref={ref}
        {...otherProps}
      />
    );
  }),
);

export default Input;
