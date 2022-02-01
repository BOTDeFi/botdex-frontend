import React, { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { observer } from 'mobx-react-lite';

import { IS_PRODUCTION } from '@/config';
import { useWalletConnectorContext } from '@/services/MetamaskConnect';
import { useMst } from '@/store';

import CopyImg from '../../../assets/img/icons/copy.svg';
import LinkImg from '../../../assets/img/icons/link.svg';
import LogoutImg from '../../../assets/img/icons/logout.svg';
import { Button } from '../../atoms';
import { Modal } from '../../molecules';

import './WalletModal.scss';

interface IImportTokensModal {
  isVisible?: boolean;
  handleClose: () => void;
}

const WalletModal: React.FC<IImportTokensModal> = observer(({ isVisible, handleClose }) => {
  const { user } = useMst();
  const { disconnect } = useWalletConnectorContext();
  const [isCopied, setIsCopied] = useState(false);

  const handleLogout = () => {
    handleClose();
    disconnect();
  };

  const handleCopy = () => {
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <Modal
      isVisible={!!isVisible}
      className="m-wallet"
      handleCancel={handleClose}
      width={390}
      closeIcon
      maskStyle={{ background: 'rgba(0,0,0,0.8)' }}
    >
      <div className="m-wallet__content">
        <div className="text-smd text-bold m-wallet__title">Your wallet</div>
        <div className="m-wallet__address text-gray-2 text-md">{user.address}</div>
        <div className="m-wallet__box">
          <a
            href={`https://${IS_PRODUCTION ? '' : 'testnet.'}bscscan.com/address/${user.address}`}
            rel="noreferrer"
            target="_blank"
            className="m-wallet__item box-f-ai-c"
          >
            <img src={LinkImg} alt="" />
            <span className="text">View on BscScan</span>
          </a>
          <CopyToClipboard text={user.address}>
            <div
              className="m-wallet__item box-f-ai-c box-pointer"
              role="button"
              tabIndex={0}
              onKeyPress={handleCopy}
              onClick={handleCopy}
            >
              <img src={CopyImg} alt="" />
              <span className="text">Copy Address</span>
            </div>
          </CopyToClipboard>
          {isCopied ? (
            <div className="m-wallet__item text-yellow">Address was copied to clipboard</div>
          ) : (
            ''
          )}
        </div>
        <Button
          className="m-wallet__btn"
          colorScheme="outline-purple"
          size="ssm"
          icon={LogoutImg}
          onClick={handleLogout}
        >
          <span>Logout</span>
        </Button>
      </div>
    </Modal>
  );
});

export default WalletModal;
