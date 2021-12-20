import React from 'react';
import { observer } from 'mobx-react-lite';

import ArrowImg from '@/assets/img/icons/arrow-btn.svg';
import InfoRImg from '@/assets/img/icons/info-r.svg';
import LinkImg from '@/assets/img/icons/open-link.svg';

import { useMst } from '../../../../store';
import { IToken } from '../../../../types';
import { Button, Switch } from '../../../atoms';
import { Modal } from '../../../molecules';

import './ImportTokensModal.scss';

interface IImportTokensModal {
  isVisible?: boolean;
  handleClose: () => void;
  handleBack: () => void;
  token?: IToken;
  handleImport: (token: IToken) => void;
}

const ImportTokensModal: React.FC<IImportTokensModal> = observer(
  ({ isVisible, handleClose, handleBack, token, handleImport }) => {
    const { tokens } = useMst();
    const [isUnderstand, setUnderstand] = React.useState<boolean>(false);

    const handleChangeUnderstand = (value: boolean): void => {
      setUnderstand(value);
    };

    const handleEnd = () => {
      if (token) {
        handleImport(token);
        if (localStorage.importTokens) {
          localStorage.importTokens = JSON.stringify([
            ...JSON.parse(localStorage.importTokens),
            token,
          ]);
          tokens.setTokens('imported', [...tokens.imported, token]);
        } else {
          localStorage.importTokens = JSON.stringify([token]);
          tokens.setTokens('imported', [token]);
        }
      }
      handleClose();
    };

    return (
      <Modal
        isVisible={!!isVisible}
        className="m-import-tokens"
        handleCancel={handleClose}
        width={390}
        closeIcon
      >
        <div className="m-import-tokens__content">
          <div
            className="m-import-tokens__title box-f-ai-c box-pointer"
            onClick={handleBack}
            onKeyDown={handleBack}
            role="button"
            tabIndex={0}
          >
            <img src={ArrowImg} alt="arrow" />
            <span className="text-bold text-black text-smd">Import Tokens</span>
          </div>
          <div className="m-import-tokens__text text-smd">
            <p>
              Anyone can create a BEP20 token on BSC with any name, including creating fake versions
              of existing tokens and tokens that claim to represent projects that do not have a
              token.
            </p>
            <p>If you purchase an arbitrary token, you may be unable to sell it back.</p>
          </div>
          <div className="m-import-tokens__alert box-f-ai-c">
            <img src={InfoRImg} alt="" />
            <span className="text-smd">Unknown Source</span>
          </div>
          {token ? (
            <div className="m-import-tokens__token box-f box-f-ai-e box-f-jc-sb">
              <div>
                <div className="text m-import-tokens__token-name">{`${token.name} (${token.symbol})`}</div>
                <div className="text-gray text-ssm m-import-tokens__token-address">
                  {token.address}
                </div>
              </div>
              <a href="/" className="m-import-tokens__token-link text-black text-ssm box-f-ai-c">
                <span>View BscScan</span>
                <img src={LinkImg} alt="" />
              </a>
            </div>
          ) : (
            ''
          )}
          <div className="m-import-tokens__switch box-f-ai-c">
            <Switch onChange={handleChangeUnderstand} defaultChecked={isUnderstand} />
            <span className="text-bold text-black">I Understand</span>
          </div>
          <Button className="m-import-tokens__btn" disabled={!isUnderstand} onClick={handleEnd}>
            <span className="text-bold text-white text-md">Import</span>
          </Button>
        </div>
      </Modal>
    );
  },
);

export default ImportTokensModal;
