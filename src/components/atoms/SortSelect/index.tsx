import React from 'react';
import { Select as AntdSelect } from 'antd';
import { SelectProps, SelectValue } from 'antd/lib/select';
import classNames from 'classnames';

import 'antd/lib/select/style/css';

import { ReactComponent as ArrowImg } from '../../../assets/img/icons/arrow-btn.svg';

import './SortSelect.scss';

const { Option } = AntdSelect;

interface ISortSelect extends SelectProps<SelectValue> {
  sortOptions?: string[];
  label?: string;
}

const SortSelect: React.FC<ISortSelect> = (props) => {
  const {
    className,
    label,
    sortOptions = ['Hot', 'APR', 'Multiplier', 'Earned', 'Liquidity'],
    onChange,
    ...otherProps
  } = props;
  const [activeValue, setActiveValue] = React.useState<any>(sortOptions[0]);
  return (
    <AntdSelect
      labelInValue
      onChange={(value: any, ...onChangeProps) => {
        setActiveValue(value.value);
        if (onChange) {
          onChange(value, ...onChangeProps);
        }
      }}
      suffixIcon={<ArrowImg />}
      value={{
        value: '',
        label: `${label} ${activeValue}`,
      }}
      {...otherProps}
      className={classNames(className, 's-sort')}
    >
      {sortOptions
        .filter((item) => item !== activeValue)
        .map((item) => (
          <Option value={item} key={item}>
            <div>{item}</div>
          </Option>
        ))}
    </AntdSelect>
  );
};

export default SortSelect;
