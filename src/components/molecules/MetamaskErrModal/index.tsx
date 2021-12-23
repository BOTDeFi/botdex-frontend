import React from 'react';
import { observer } from 'mobx-react-lite';

import { useMst } from '@/store';

import MetamaskImg from '../../../assets/img/icons/metamask.svg';
import Modal from '../Modal';

import './MetamaskErrModal.scss';

const MetamaskErrModal: React.FC = observer(() => {
  const { modals } = useMst();
  return (
    <Modal isVisible={!!modals.metamaskErr.errMsg} className="m-metamask" closeIcon destroyOnClose>
      <div className="m-metamask__content">
        <img src={MetamaskImg} alt="" className="m-metamask__img" />
        <p className="text-md">{modals.metamaskErr.errMsg}</p>
      </div>
    </Modal>
  );
});

export default MetamaskErrModal;
