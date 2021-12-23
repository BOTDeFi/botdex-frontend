import React from 'react';
import { Modal as ModalAntd } from 'antd';
import classNames from 'classnames';

import 'antd/lib/modal/style/css';

import { ReactComponent as ClearImg } from '../../../assets/img/icons/close-new.svg';

import './Modal.scss';

interface IModal {
  isVisible: boolean;
  // eslint-disable-next-line react/require-default-props
  handleCancel?: () => void;
  // eslint-disable-next-line react/require-default-props
  width?: number | string;
  // eslint-disable-next-line react/require-default-props
  className?: string;
  // eslint-disable-next-line react/require-default-props
  destroyOnClose?: boolean;
  // eslint-disable-next-line react/require-default-props
  closeIcon?: boolean;
}

const Modal: React.FC<IModal> = ({
  children,
  isVisible,
  handleCancel,
  width = 'fit-content',
  className,
  destroyOnClose = false,
  closeIcon = false,
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
    >
      {children}
    </ModalAntd>
  );
};

export default Modal;
