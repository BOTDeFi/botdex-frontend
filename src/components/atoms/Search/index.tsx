import React from 'react';
import { Input as AntdInput } from 'antd';
import cn from 'classnames';

import LupaImg from '../../../assets/img/icons/lupa.svg';
import { Button, Input, InputNumber } from '..';

import './Search.scss';

interface ISearch {
  className?: string;
  size?: 'sm' | 'lg' | 'md';
  realtime?: boolean;
  type?: 'text' | 'number';
  placeholder?: string;
  value?: string;
  onChange?: (value: number | string) => void;
  btn?: boolean;
  colorScheme?: 'transparent' | 'gray';
}

const Search: React.FC<ISearch> = React.memo(
  ({
    className,
    type = 'text',
    placeholder,
    size = 'sm',
    realtime,
    onChange,
    btn,
    colorScheme = 'transparent',
    value,
  }) => {
    const [inputValue, setInputValue] = React.useState<number | string>(value || '');

    const inputRef = React.useRef<AntdInput>(null);
    const inputNumberRef = React.useRef<HTMLInputElement>(null);

    const handleChange = (impValue: number | string) => {
      setInputValue(impValue);
      if (realtime && onChange) {
        onChange(impValue);
      }
    };

    const handleImgClick = () => {
      if (inputValue) {
        return onChange && onChange(inputValue);
      }
      if (type === 'text') {
        return inputRef.current && inputRef.current.focus();
      }
      if (type === 'number') {
        return inputNumberRef.current && inputNumberRef.current.focus();
      }
      return undefined;
    };

    const handleEnterDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && e.currentTarget.value && !e.repeat) {
        return onChange && onChange(inputValue);
      }
      return undefined;
    };

    return (
      <div className={cn('search box-f-ai-c', `input-${size}`, `search-${colorScheme}`, className)}>
        <div
          className="search__img"
          onClick={handleImgClick}
          onKeyDown={handleImgClick}
          role="button"
          tabIndex={-1}
        >
          <img src={LupaImg} alt="search" />
        </div>
        {type === 'number' && (
          <InputNumber
            onChange={handleChange}
            onKeyDown={handleEnterDown}
            colorScheme="transparent"
            ref={inputNumberRef}
            inputSize={size}
            value={inputValue}
            inputClass={cn({
              'text-md': size === 'lg',
            })}
          />
        )}
        {type === 'text' && (
          <Input
            value={inputValue}
            className={cn({
              'text-md': size === 'lg',
              'text': size === 'sm',
            })}
            ref={inputRef}
            placeholder={placeholder}
            onChange={(e: any) => handleChange(e.target.value)}
            onKeyDown={handleEnterDown}
            colorScheme="transparent"
          />
        )}
        {btn && (
          <Button onClick={handleImgClick}>
            <span className="text-bold text-md text-white">Search</span>
          </Button>
        )}
      </div>
    );
  },
);

export default Search;
