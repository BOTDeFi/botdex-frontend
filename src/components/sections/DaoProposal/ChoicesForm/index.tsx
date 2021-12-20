import React, { useState } from 'react';
import { Form as FormAntd, FormInstance } from 'antd';
import classNames from 'classnames';

import closeIcon from '@/assets/img/icons/cross.svg';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import { debounce } from '@/utils/debounce';

interface IChoicesFormProps {
  form: FormInstance;
  validateForms: () => void;
  inputClassName?: string;
  inputPostfixClassName?: string;
  formErrorsClassName?: string;
  buttonClassName?: string;
}

const ChoicesForm: React.FC<IChoicesFormProps> = ({
  form,
  validateForms,
  inputClassName,
  inputPostfixClassName,
  formErrorsClassName,
  buttonClassName,
}) => {
  const [choicesFormError, setChoicesFormError] = useState(['']);
  const debouncedUpdateChoicesFormFieldsError = debounce(
    () => {
      const formFields = form.getFieldsError();
      formFields.some(({ errors }, index) => {
        if (errors.length || index === formFields.length - 1) {
          setChoicesFormError(errors);
        }
        return Boolean(errors.length);
      });
    },
    1000,
    false,
  );

  const onFormChange = () => {
    debouncedUpdateChoicesFormFieldsError();
    validateForms();
  };

  return (
    <FormAntd
      name="choicesForm"
      form={form}
      initialValues={{
        choices: [undefined, undefined],
      }}
      onValuesChange={onFormChange}
    >
      <FormAntd.List name="choices">
        {(fields, { add, remove }) => (
          <>
            {fields.map((field) => (
              <FormAntd.Item key={field.key} required={false} help={<></>}>
                <FormAntd.Item
                  {...field}
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: 'Choices must not be empty',
                    },
                    {
                      max: 36,
                      message: 'Character limit exceeded',
                    },
                  ]}
                  noStyle
                >
                  <Input
                    className={classNames(inputClassName)}
                    placeholder="Input choice text"
                    colorScheme="outline"
                    inputSize="lg"
                  />
                </FormAntd.Item>
                {fields.length > 2 && (
                  <Button
                    className={classNames(inputPostfixClassName)}
                    icon={closeIcon}
                    colorScheme="outline-purple"
                    size="md"
                    onClick={() => remove(field.name)}
                  />
                )}
              </FormAntd.Item>
            ))}
            <div className={classNames(formErrorsClassName, 'text-ssm')}>{choicesFormError}</div>
            <Button className={classNames(buttonClassName, 'text-bold')} onClick={() => add()}>
              Add choice
            </Button>
          </>
        )}
      </FormAntd.List>
    </FormAntd>
  );
};

export default ChoicesForm;
