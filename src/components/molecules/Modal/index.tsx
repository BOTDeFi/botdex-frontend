import React, { CSSProperties } from 'react';
import { Modal as ModalAntd } from 'antd';
import classNames from 'classnames';

import 'antd/lib/modal/style/css';

import { ReactComponent as ClearImg } from '../../../assets/img/icons/cross.svg';

import './Modal.scss';

interface IModal {
  isVisible: boolean;
  handleCancel?: () => void;
  width?: number | string;
  className?: string;
  destroyOnClose?: boolean;
  closeIcon?: boolean;
  maskStyle?: CSSProperties;
  wrapClassName?: string;
}

const Modal: React.FC<IModal> = ({
  children,
  isVisible,
  handleCancel,
  width = 'fit-content',
  className,
  destroyOnClose = false,
  closeIcon = false,
  maskStyle,
  wrapClassName,
}) => {
  return (
    <ModalAntd
      title={false}
      visible={isVisible}
      footer={false}
      closable={closeIcon}
      closeIcon={<ClearImg />}
      onCancel={handleCancel}
      centered
      destroyOnClose={destroyOnClose}
      width={width}
      className={classNames('modal', className)}
      maskStyle={maskStyle}
      wrapClassName={wrapClassName}
    >
      {children}
    </ModalAntd>
  );
};

export default Modal;
