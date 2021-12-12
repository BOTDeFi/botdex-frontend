import React from 'react';
// import { RadioChangeEvent } from 'antd';
import { Scrollbar } from 'react-scrollbars-custom';
// import cn from 'classnames';
import { observer } from 'mobx-react-lite';

// import LogoMiniImg from '@/assets/img/icons/logo-m.svg';
import UnknownImg from '@/assets/img/currency/unknown.svg';
import ArrowImg from '@/assets/img/icons/arrow-btn.svg';
import CrossImg from '@/assets/img/icons/cross.svg';
import OpenLinkImg from '@/assets/img/icons/open-link.svg';
import { Button, Input } from '@/components/atoms';
import { Modal } from '@/components/molecules';
import { contracts } from '@/config';
import { useWalletConnectorContext } from '@/services/MetamaskConnect';
import { useMst } from '@/store';
// import { RadioGroup, Input, Switch, Button } from '../../../atoms';
import { IToken } from '@/types';

import { ImportTokensModal } from '..';

import './ManageTokensModal.scss';

interface IManageTokensModal {
  isVisible?: boolean;
  handleClose: () => void;
  handleBack: () => void;
  handleOpen: () => void;
  handleChangeSwitch: (extendedValue: boolean, topValue: boolean) => void;
  selectToken: (token: IToken) => void;
}

const ManageTokensModal: React.FC<IManageTokensModal> = observer(
  ({ isVisible, handleClose, handleOpen, handleBack, selectToken }) => {
    const { metamaskService } = useWalletConnectorContext();
    const { tokens } = useMst();

    // const [acitveTab, setActiveTab] = React.useState<'lists' | 'tokens'>('lists');
    // const [isExtendedTokensActive, setExtendedTokensActive] = React.useState<boolean>(false);
    // const [isTopTokensActive, setTopTokensActive] = React.useState<boolean>(false);
    const [unknownToken, setUnknowToken] = React.useState<IToken | undefined>(undefined);
    const [selectedToken, setSelectedToken] = React.useState<IToken | undefined>();
    const [isLoading, setLoading] = React.useState<boolean>(false);
    const [searchedValue, setSearchedValue] = React.useState<string>('');

    // const handleChangeNavbar = ({ target }: RadioChangeEvent): void => {
    //   setActiveTab(target.value);
    // };

    // const handleChangeExtendedTokensSwitch = (value: boolean): void => {
    //   handleChangeSwitch(value, isTopTokensActive);
    //   setExtendedTokensActive(value);
    // };

    // const handleChangeTopTokensSwitch = (value: boolean): void => {
    //   handleChangeSwitch(isExtendedTokensActive, value);
    //   setTopTokensActive(value);
    // };

    const handleOpenImportTokensModal = (token: IToken): void => {
      handleClose();
      setSelectedToken(token);
    };

    const handleCloseImportTokensModal = (): void => {
      setSelectedToken(undefined);
    };

    const handleBackToManageTokensModal = (): void => {
      handleCloseImportTokensModal();
      handleOpen();
    };

    const handleChangeTokensInput = async ({ target }: React.ChangeEvent<HTMLInputElement>) => {
      setSearchedValue(target.value);
      if (target.value) {
        try {
          setLoading(true);
          const token = await metamaskService.getTokenInfo(target.value, contracts.ERC20.ABI);
          setUnknowToken({
            ...token,
            logoURI: UnknownImg,
          });
          setLoading(false);
        } catch (err) {
          setLoading(false);
          setUnknowToken(undefined);
        }
      } else {
        setUnknowToken(undefined);
      }
    };

    const handleDeleteImportedToken = (tokenAddress: string): void => {
      const filteredArr = tokens.imported.filter((token: IToken) => token.address !== tokenAddress);
      localStorage.importTokens = filteredArr;

      tokens.setTokens('imported', filteredArr);

      if (unknownToken?.address === tokenAddress) {
        setUnknowToken(undefined);
      }
    };

    const handleCloseModal = (): void => {
      handleClose();
      setUnknowToken(undefined);
    };

    return (
      <>
        <Modal
          isVisible={!!isVisible}
          className="m-manage-tokens"
          handleCancel={handleCloseModal}
          width={390}
          destroyOnClose
          closeIcon
        >
          <div className="m-manage-tokens__content">
            <div
              className="m-manage-tokens__title box-f-ai-c box-pointer"
              onClick={handleBack}
              onKeyDown={handleBack}
              role="button"
              tabIndex={0}
            >
              <img src={ArrowImg} alt="" />
              <span className="text-black text-bold text-smd">Manage</span>
            </div>
            {/* <RadioGroup
              className="m-manage-tokens__radio"
              onChange={handleChangeNavbar}
              buttonStyle="solid"
              defaultValue={acitveTab}
              items={[
                {
                  text: 'Lists',
                  value: 'lists',
                },
                {
                  text: 'Tokens',
                  value: 'tokens',
                },
              ]}
            /> */}
            {/* {acitveTab === 'lists' ? (
              <>
                <Input
                  className="m-manage-tokens__input"
                  placeholder="http:// or ipfs:// or ENS name"
                  colorScheme="outline"
                  inputSize="lg"
                />
                <div
                  className={cn('m-manage-tokens__item box-f-ai-c box-f-jc-sb', {
                    active: isExtendedTokensActive,
                  })}
                >
                  <div className="box-f-ai-c">
                    <img
                      src={LogoMiniImg}
                      alt="refinery finance"
                      className="m-manage-tokens__item-logo"
                    />
                    <div>
                      <div className="text-med text-yellow m-manage-tokens__item-title text">
                        Refinery.Finance Extended
                      </div>
                      <div className="text-med text-gray text-ssm text">
                        {tokens.extended.length} tokens
                      </div>
                    </div>
                  </div>
                  <Switch
                    colorScheme="white-purple"
                    switchSize="bg"
                    defaultChecked={isExtendedTokensActive}
                    onChange={handleChangeExtendedTokensSwitch}
                  />
                </div>
                <div
                  className={cn('m-manage-tokens__item box-f-ai-c box-f-jc-sb', {
                    active: isTopTokensActive,
                  })}
                >
                  <div className="box-f-ai-c">
                    <img
                      src={LogoMiniImg}
                      alt="refinery finance"
                      className="m-manage-tokens__item-logo"
                    />
                    <div>
                      <div className="text-med text-yellow m-manage-tokens__item-title text">
                        Refinery.Finance Top 100
                      </div>
                      <div className="text-med text-gray text-ssm text">
                        {tokens.top.length} tokens
                      </div>
                    </div>
                  </div>
                  <Switch
                    colorScheme="white-purple"
                    switchSize="bg"
                    defaultChecked={isTopTokensActive}
                    onChange={handleChangeTopTokensSwitch}
                  />
                </div>{' '}
              </>
            ) : (
              ''
            )} */}
            {/* {acitveTab === 'tokens' ? (
              <> */}
            <Input
              className="m-manage-tokens__input"
              placeholder="0x00"
              colorScheme="outline"
              inputSize="lg"
              value={searchedValue}
              onChange={handleChangeTokensInput}
            />
            {isLoading ? <div className="text-smd m-manage-tokens__info">Loading</div> : ''}
            {!isLoading && searchedValue && !unknownToken ? (
              <div className="text-smd text-red m-manage-tokens__info">not found</div>
            ) : (
              ''
            )}
            {unknownToken ? (
              <div
                key={unknownToken.address}
                className="m-manage-tokens__token box-f-ai-c box-f-jc-sb"
              >
                <div className="box-f-ai-c">
                  <img
                    src={unknownToken.logoURI}
                    alt={unknownToken.name}
                    className="m-manage-tokens__token-img"
                  />
                  <div>
                    <div className="text m-manage-tokens__token-name">{unknownToken.name}</div>
                    <div className="text-gray text-ssm">{unknownToken.symbol}</div>
                  </div>
                </div>
                {tokens.imported &&
                [...tokens.imported, ...tokens.default].find(
                  (token: IToken) => token.address === unknownToken.address,
                ) ? (
                  <span className="text-yellow text-med text-ssm">Active</span>
                ) : (
                  <Button size="smd" onClick={() => handleOpenImportTokensModal(unknownToken)}>
                    <span className="text-bold text-white text-smd">Import</span>
                  </Button>
                )}
              </div>
            ) : (
              ''
            )}
            {tokens.imported.length ? (
              <Scrollbar
                className="m-select-token__scroll"
                style={{
                  width: '100%',
                  height: tokens.imported.length > 8 ? '55vh' : `${tokens.imported.length * 55}px`,
                }}
              >
                {tokens.imported.map((token: IToken) => (
                  <div
                    key={token.address}
                    className="m-manage-tokens__token-imported box-f-ai-c box-f-jc-sb"
                  >
                    <div className="box-f-ai-c">
                      <img
                        src={token.logoURI}
                        alt={token.name}
                        className="m-manage-tokens__token-img"
                      />
                      <div>
                        <div className="text m-manage-tokens__token-name">{token.name}</div>
                        <div className="text-gray text-ssm">{token.symbol}</div>
                      </div>
                    </div>
                    <div className="box-f-ai-c">
                      <div
                        className="box-pointer m-manage-tokens__token-delete"
                        onClick={() => handleDeleteImportedToken(token.address)}
                        onKeyDown={() => handleDeleteImportedToken(token.address)}
                        role="button"
                        tabIndex={0}
                      >
                        <img src={CrossImg} alt={token.name} />
                      </div>
                      <a href="/" className="m-manage-tokens__token-open">
                        <img src={OpenLinkImg} alt="" />
                      </a>
                    </div>
                  </div>
                ))}
              </Scrollbar>
            ) : (
              ''
            )}
            <div className="text-med text text-black m-manage-tokens__text">
              {tokens.imported.length || 0} Custom Tokens
            </div>
            {/* </>
            ) : (
              ''
            )} */}
          </div>
        </Modal>
        <ImportTokensModal
          isVisible={!!selectedToken}
          handleClose={handleCloseImportTokensModal}
          handleBack={handleBackToManageTokensModal}
          token={selectedToken}
          handleImport={selectToken}
        />
      </>
    );
  },
);

export default ManageTokensModal;
