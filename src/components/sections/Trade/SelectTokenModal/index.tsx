import React from 'react';
import { Scrollbar } from 'react-scrollbars-custom';
import { observer } from 'mobx-react-lite';

import UnknownImg from '@/assets/img/currency/unknown.svg';
import { useMst } from '@/store';
import { IToken } from '@/types';

import { Search } from '../../../atoms';
import { Modal } from '../../../molecules';
import { ManageTokensModal } from '..';

import './SelectTokenModal.scss';

interface ISelectTokenModal {
  isVisible?: boolean;
  handleClose: () => void;
  handleOpen: () => void;
  handleChangeToken: (type: 'from' | 'to', token: IToken) => void;
  tokenType: 'from' | 'to';
}

const SelectTokenModal: React.FC<ISelectTokenModal> = observer(
  ({ isVisible, handleClose, handleChangeToken, tokenType, handleOpen }) => {
    const { tokens: storeTokens } = useMst();

    const [isManageModalVisible, setManageModalVisible] = React.useState<boolean>(false);

    const [tokens, setTokens] = React.useState<IToken[] | []>([]);
    const [initTokens, setInitTokens] = React.useState<IToken[] | []>([]);

    const handleSearch = (value: number | string): void => {
      if (value === '') {
        setTokens(initTokens);
        return;
      }
      setTokens(
        initTokens.filter((token) => {
          if (typeof value === 'string') {
            return (
              token.name.substr(0, value.length).toLowerCase() === value.toLowerCase() ||
              token.symbol.substr(0, value.length).toLowerCase() === value.toLowerCase()
            );
          }
          return false;
        }),
      );
    };

    const handleTokenClick = (token: IToken) => {
      handleChangeToken(tokenType, token);
      handleClose();
    };

    const handleCloseManageModal = (): void => {
      setManageModalVisible(false);
    };

    const handleOpenManageModal = (): void => {
      setTokens(initTokens);
      handleClose();
      setManageModalVisible(true);
    };

    const handleBackToSelectTokenModal = (): void => {
      handleCloseManageModal();
      handleOpen();
    };

    const onCloseModal = () => {
      setInitTokens([...storeTokens.imported, ...storeTokens.default]);
      setTokens([...storeTokens.imported, ...storeTokens.default]);
      handleClose();
    };

    const handleChangeSwitch = (extendedValue: boolean, topValue: boolean): void => {
      let arr: IToken[] = storeTokens.default;
      if (extendedValue && topValue) {
        arr = [...storeTokens.extended, ...storeTokens.top];
      }
      if (extendedValue) {
        arr = storeTokens.extended;
      }
      if (topValue) {
        arr = [...storeTokens.default, ...storeTokens.top];
      }

      setInitTokens([...storeTokens.imported, ...arr]);

      setTokens([...storeTokens.imported, ...arr]);
    };

    React.useEffect(() => {
      setInitTokens([...storeTokens.imported, ...storeTokens.default]);
      setTokens([...storeTokens.imported, ...storeTokens.default]);
    }, [
      storeTokens.default,
      storeTokens.default.length,
      storeTokens.imported,
      storeTokens.imported.length,
    ]);

    return (
      <>
        <Modal
          isVisible={!!isVisible}
          className="m-select-token"
          handleCancel={onCloseModal}
          width={300}
          destroyOnClose
          closeIcon
        >
          <div className="m-select-token__content">
            <div className="m-select-token__title text-white text-bold text-smd">
              Select a token
            </div>

            <div className="m-select-token__search">
              <Search placeholder="Search" realtime onChange={handleSearch} />
            </div>

            {tokens.length ? (
              <Scrollbar
                className="m-select-token__scroll"
                style={{
                  width: '100%',
                  height: tokens.length > 5 ? '55vh' : `${tokens.length * 65}px`,
                }}
              >
                {[...tokens].map((token: IToken) => (
                  <div
                    className="m-select-token__item box-f-ai-c"
                    key={token.address}
                    onClick={() => handleTokenClick(token)}
                    onKeyDown={() => handleTokenClick(token)}
                    role="button"
                    tabIndex={-2}
                  >
                    <img
                      onError={(e: any) => {
                        e.target.src = UnknownImg;
                      }}
                      src={token.logoURI}
                      alt=""
                    />
                    <div>
                      <div>{token.name}</div>
                      <div className="text-ssm text-gray">{token.symbol}</div>
                    </div>
                  </div>
                ))}
              </Scrollbar>
            ) : (
              <span className="text">Not found</span>
            )}
            <div
              className="m-select-token__manage text-white text-center box-pointer"
              onClick={handleOpenManageModal}
              onKeyDown={handleOpenManageModal}
              role="button"
              tabIndex={0}
            >
              Manage Tokens
            </div>
          </div>
        </Modal>
        <ManageTokensModal
          isVisible={isManageModalVisible}
          handleClose={handleCloseManageModal}
          handleBack={handleBackToSelectTokenModal}
          handleOpen={handleOpenManageModal}
          handleChangeSwitch={handleChangeSwitch}
          selectToken={handleTokenClick}
        />
      </>
    );
  },
);

export default SelectTokenModal;
