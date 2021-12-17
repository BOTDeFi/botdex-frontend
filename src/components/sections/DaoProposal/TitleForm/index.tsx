import React, { useState } from 'react';
import { Form as FormAntd, FormInstance } from 'antd';
import classNames from 'classnames';

import Input from '@/components/atoms/Input';

interface ITitleFormProps {
  form: FormInstance;
  validateForms: () => void;
  fieldClassName?: string;
  inputClassName?: string;
}

const TitleForm: React.FC<ITitleFormProps> = ({
  form,
  validateForms,
  fieldClassName,
  inputClassName,
}) => {
  const [titleValue, setTitleValue] = useState('');
  const titleInputHandler = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    setTitleValue(target.value);
  };

  return (
    <FormAntd name="titleForm" form={form} layout="vertical" onValuesChange={validateForms}>
      <FormAntd.Item
        className={classNames(fieldClassName)}
        name="title"
        rules={[
          {
            required: true,
            whitespace: true,
            message: 'Title must not be empty',
          },
          {
            max: 100, // snapshot.js backend allows up to 256 chars
            message: 'Character limit exceeded',
          },
        ]}
      >
        <Input
          className={classNames(inputClassName)}
          colorScheme="outline"
          inputSize="lg"
          value={titleValue}
          onChange={titleInputHandler}
        />
      </FormAntd.Item>
    </FormAntd>
  );
};

export default TitleForm;
