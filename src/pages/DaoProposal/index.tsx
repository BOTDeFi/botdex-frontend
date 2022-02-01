import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { Form as FormAntd } from 'antd';
import { observer } from 'mobx-react-lite';

import Button from '@/components/atoms/Button';
import ReactMarkdown from '@/components/molecules/ReactMarkdown';
import EasyMde from '@/components/organisms/EasyMde';
import { DaoSection, DaoWrapper } from '@/components/sections/Dao';
import { ActionsForm, ChoicesForm, TitleForm } from '@/components/sections/DaoProposal';
import { getMomentMergedDateTime } from '@/components/sections/DaoProposal/helpers';
import { useCreateProposal } from '@/hooks/dao/useCreateProposal';
import {
  hasCurrentBalance,
  requestHasCurrentBalance,
  useGetCurrentBalance,
} from '@/services/api/refinery-finance-pairs';
import { useWalletConnectorContext } from '@/services/MetamaskConnect';
import { useMst } from '@/store';
import { debounce } from '@/utils/debounce';

import 'antd/lib/form/style/css';
import 'antd/lib/time-picker/style/css';
import 'antd/lib/date-picker/style/css';

import './DaoProposal.scss';

const extractDataForProposalFromForms = (forms: Array<any>) => {
  const [
    { title }, // has empty data, so skip it
    ,
    { choices },
    { actionsForm_start_date, actionsForm_start_time, actionsForm_end_date, actionsForm_end_time },
  ] = forms;

  const start = getMomentMergedDateTime(actionsForm_start_date, actionsForm_start_time).unix();
  const end = getMomentMergedDateTime(actionsForm_end_date, actionsForm_end_time).unix();

  return {
    name: title,
    choices,
    start,
    end,
  };
};

const ConnectWalletButton: React.FC = () => {
  const { connect } = useWalletConnectorContext();
  return (
    <Button className="actions-section__submit" onClick={connect}>
      <span className="text-white text-smd text-bold">Connect Wallet</span>
    </Button>
  );
};

const DaoProposal: React.FC = observer(() => {
  const history = useHistory();
  const [titleForm] = FormAntd.useForm();
  const [contentForm] = FormAntd.useForm();
  const [choicesForm] = FormAntd.useForm();
  const [actionsForm] = FormAntd.useForm();
  const forms = [titleForm, contentForm, choicesForm, actionsForm];

  const { user } = useMst();

  const [isFormsValidated, setFormsValidated] = useState(false);
  const [editorPlainText, setEditorPlainText] = useState('');

  const handleEasyMdeChange = (text: string) => {
    validateForms();
    setEditorPlainText(text);
  };

  const [pendingTx, setPendingTx] = useState(false);
  const { createProposal } = useCreateProposal({
    onSuccessTx: ({ ipfsHash }) => {
      // Redirect user to newly created proposal page
      history.push(`/dao/${ipfsHash}`);
    },
    onStartTx: () => setPendingTx(true),
    onEndTx: () => setPendingTx(false),
  });

  const onSubmit = async () => {
    // In case when user entered CORRECT data, and then, makes it WRONG (but function is debounced/throttled)
    const isFormValid = await validateFormsAsync();
    if (isFormValid) {
      const formsValidationResult = forms.map((form) => form.getFieldsValue());
      const proposalData = {
        ...extractDataForProposalFromForms(formsValidationResult),
        body: editorPlainText,
      };
      createProposal(proposalData);
    } else {
      setFormsValidated(false);
    }
  };

  const getFormsValidationPromises = () => {
    return Object.values(forms).map((form) => {
      // validate only fields were touched
      // contentForm is never touched so, anyway explicitly call its form.validateFields()
      if (!form.isFieldsTouched() && form !== contentForm) {
        return Promise.reject(new Error('Form fields are never touched'));
      }
      return form.validateFields();
    });
  };

  /**
   * It is async/await version of validateForms, also with useState, to validate like synchronously.
   */
  const validateFormsAsync = async () => {
    const formsValidationPromises = getFormsValidationPromises();
    try {
      await Promise.all(formsValidationPromises);
      // if form fields are validated without errors, then send requests to check votingPower
      const currentBalance = await requestHasCurrentBalance(user.address, client);
      if (!currentBalance) throw new Error('No balance');
      return true;
    } catch (err) {
      return false;
    }
  };
  const validateForms = debounce(
    () => {
      const formsValidationPromises = getFormsValidationPromises();
      Promise.all(formsValidationPromises)
        .then(() => {
          setFormsValidated(true);
        })
        .then(() => {
          // if form fields are validated without errors, then send requests to check votingPower
          getNewCurrentBalance();
        })
        .catch(() => {
          setFormsValidated(false);
        });
    },
    1500,
    false,
  );

  const {
    getCurrentBalance,
    options: [
      ,
      { loading: currentBalanceLoading, error: currentBalanceError, data: currentBalance, client },
    ],
  } = useGetCurrentBalance({ fetchPolicy: 'network-only' });

  const getNewCurrentBalance = useCallback(() => {
    if (user.address) {
      getCurrentBalance(user.address);
    }
  }, [user.address, getCurrentBalance]);

  useEffect(() => {
    getNewCurrentBalance();
  }, [getNewCurrentBalance]);

  const hasBalance = hasCurrentBalance({ error: currentBalanceError, data: currentBalance });
  const isAbleToPublish = hasBalance && isFormsValidated && !pendingTx;
  const isProcessingValidation = currentBalanceLoading || pendingTx;

  return (
    <DaoWrapper>
      <div className="dao-proposal__wrapper">
        <div className="dao-proposal__column">
          <DaoSection
            className="dao-proposal__section title-section"
            title="Title"
            customClasses={{ body: 'dao-proposal__section-body' }}
          >
            <TitleForm
              form={titleForm}
              validateForms={validateForms}
              fieldClassName="title-section__field"
              inputClassName="title-section__input"
            />
          </DaoSection>

          <DaoSection
            className="dao-proposal__section"
            title={
              <>
                <div>Content</div>
                <span className="dao-proposal__section-header-tip text-norm text-smd">
                  Tip: write in Markdown!
                </span>
              </>
            }
            customClasses={{ body: 'dao-proposal__section-body' }}
          >
            <FormAntd name="contentForm" form={contentForm} layout="vertical">
              <FormAntd.Item
                className="content-section__field"
                name="content"
                rules={[
                  {
                    validator: () => {
                      if (editorPlainText.trim().length) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Content must not be empty'));
                    },
                  },
                ]}
              >
                <EasyMde
                  id="body"
                  name="body"
                  onTextChange={handleEasyMdeChange}
                  value={editorPlainText}
                />
              </FormAntd.Item>
            </FormAntd>
          </DaoSection>

          {editorPlainText && (
            <DaoSection
              className="dao-proposal__section"
              title="Preview"
              customClasses={{ body: 'dao-proposal__section-body' }}
            >
              <ReactMarkdown className="text-yellow">{editorPlainText}</ReactMarkdown>
            </DaoSection>
          )}

          <DaoSection
            className="dao-proposal__section"
            title="Choices"
            customClasses={{ body: 'dao-proposal__section-body' }}
          >
            <ChoicesForm
              form={choicesForm}
              validateForms={validateForms}
              inputClassName="choices-section__input"
              inputPostfixClassName="choices-section__input-postfix"
              formErrorsClassName="choices-section__form-errors"
              buttonClassName="choices-section__button"
            />
          </DaoSection>
        </div>

        <div className="dao-proposal__column">
          <DaoSection className="dao-proposal__section" title="Actions">
            <ActionsForm
              form={actionsForm}
              validateForms={validateForms}
              snapshotClassName="actions-section__snapshot"
              snapshotTitleClassName="actions-section__snapshot-title"
            />
            {!user.address ? (
              <ConnectWalletButton />
            ) : (
              <Button
                className="actions-section__submit"
                loading={isProcessingValidation}
                disabled={!isAbleToPublish}
                onClick={isAbleToPublish ? onSubmit : undefined}
              >
                <span className="text-white text-smd text-bold">Publish</span>
              </Button>
            )}
            {!hasBalance && !currentBalanceLoading && (
              <div style={{ color: 'red', marginTop: 10 }}>
                You need voting power to publish a proposal.
              </div>
            )}
          </DaoSection>
        </div>
      </div>
    </DaoWrapper>
  );
});

export default DaoProposal;
