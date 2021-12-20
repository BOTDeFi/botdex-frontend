import React from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';

import { useMst } from '@/store';
import { feeFormatter } from '@/utils/formatters';

import { secondsToHoursFormatter } from '../utils';

const TextUnstakingFee: React.FC<{ className?: string }> = observer(({ className }) => {
  const {
    pools: {
      fees: { withdrawalFee, withdrawalFeePeriod },
    },
  } = useMst();
  return (
    <div className={classNames(className, 'text-smd text-blue-d')}>
      {feeFormatter(withdrawalFee)}% unstaking fee if withdrawn within{' '}
      {secondsToHoursFormatter(withdrawalFeePeriod)}
    </div>
  );
});

export default TextUnstakingFee;
