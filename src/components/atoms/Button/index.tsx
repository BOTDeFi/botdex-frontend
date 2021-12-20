import React from 'react';
import { Link } from 'react-router-dom';
import { Button as BtnAntd } from 'antd';
import classNames from 'classnames';

import { ReactComponent as ArrowImg } from '@/assets/img/icons/arrow-btn.svg';

import 'antd/lib/button/style/css';

import './Button.scss';

export type ColorScheme =
  | 'yellow'
  | 'outline'
  | 'white'
  | 'outline-purple'
  | 'outline-green'
  | 'outline-black'
  | 'purple'
  | 'gray'
  | 'yellow-l';
export interface IColorScheme {
  colorScheme?: ColorScheme;
}

export interface ISize {
  size?: 'ssm' | 'sm' | 'lsm' | 'smd' | 'md' | 'lmd' | 'lg';
}

export interface ButtonProps extends IColorScheme, ISize {
  onClick?: (e?: any) => void;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  link?: any;
  linkClassName?: string;
  shadow?: boolean;
  icon?: string;
  arrow?: boolean;
  toggle?: boolean;
  onToggle?: (value: boolean) => void;
  isActive?: boolean | null;
  noclick?: boolean;
  title?: string;
  onKeyDown?: (e: any) => void;
}

const Button: React.FC<ButtonProps> = React.memo(
  ({
    children,
    className,
    size = 'md',
    colorScheme = 'cold-blue',
    onClick,
    disabled = false,
    loading = false,
    link,
    linkClassName,
    icon,
    arrow,
    toggle,
    isActive = null,
    onToggle,
    noclick,
    loadingText,
    title,
    onKeyDown,
  }) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!link) e.stopPropagation();
      if (toggle && onToggle) {
        onToggle(!isActive);
      }
      return onClick && onClick();
    };

    const BtnContent = (
      <>
        {icon ? <img src={icon} alt="icon" className="btn-icon" /> : <></>}
        {children}
        {arrow ? <ArrowImg className="btn__arrow" /> : ''}
      </>
    );

    const Btn = (
      <BtnAntd
        className={classNames(
          className || '',
          'text btn box-f-c',
          `btn-${size}`,
          `btn-${colorScheme}`,
          {
            'btn-loading': loading,
            'active': isActive,
            noclick,
          },
        )}
        title={title}
        disabled={disabled || loading}
        onClick={handleClick}
        onKeyDown={onKeyDown}
      >
        {loading ? `${loadingText || 'In progress...'}` : BtnContent}
      </BtnAntd>
    );
    if (link) {
      return (
        <Link className={classNames('btn-link', linkClassName)} to={link}>
          {Btn}
        </Link>
      );
    }
    return Btn;
  },
);

export default Button;
