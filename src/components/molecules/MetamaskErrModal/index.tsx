import React from 'react';
import { observer } from 'mobx-react-lite';

import MetamaskImg from '@/assets/img/icons/metamask.svg';
import { useMst } from '@/store';

import Modal from '../Modal';

import './MetamaskErrModal.scss';

const MetamaskErrModal: React.FC = observer(() => {
  const { modals } = useMst();
  const handleClose = React.useCallback(() => {
    modals.metamaskErr.close();
  }, [modals]);
  return (
    <Modal
      isVisible={!!modals.metamaskErr.errMsg}
      className="m-metamask"
      handleCancel={handleClose}
    >
      <div className="m-metamask__content">
        <img src={MetamaskImg} alt="" className="m-metamask__img" />
        <p className="text-md">{modals.metamaskErr.errMsg}</p>
      </div>
    </Modal>
  );
});

export default MetamaskErrModal;
