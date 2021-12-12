import React from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';

import { Button } from '@/components/atoms';
import { useLpTokenPrice } from '@/hooks/farms/useFarmsPrices';
import { useMst } from '@/store';
import { useFarmUserData } from '@/store/farms/hooks';
import { Farm } from '@/types';
import { getAddLiquidityUrl } from '@/utils/urlConstructors';

import './FarmsStakeUnstakeButtons.scss';

const FarmsStakeUnstakeButtons: React.FC<{
  className?: string;
  farm: Farm;
}> = observer(({ className, farm }) => {
  const { pid, lpSymbol, quoteToken, token } = farm;
  const { tokenBalance, stakedBalance } = useFarmUserData(farm);

  const { modals } = useMst();

  const lpPrice = useLpTokenPrice(lpSymbol);

  const buttons = [
    {
      handler: () => {
        modals.farmsStakeUnstake.open({
          isStaking: false,
          maxValue: stakedBalance.toString(),
          lpPrice: lpPrice.toString(),
          tokenSymbol: lpSymbol,
          farmId: pid,
          addLiquidityUrl: '',
        });
      },
      text: '-',
    },
    {
      handler: () => {
        modals.farmsStakeUnstake.open({
          isStaking: true,
          maxValue: tokenBalance.toString(),
          lpPrice: lpPrice.toString(),
          tokenSymbol: lpSymbol,
          farmId: pid,
          addLiquidityUrl: getAddLiquidityUrl(quoteToken, token),
        });
      },
      text: '+',
    },
  ];
  return (
    <div className={classNames(className, 'pools-stake-unstake-buttons', 'box-f')}>
      {buttons.map(({ text, handler }) => (
        <Button key={text} colorScheme="outline-purple" size="ssm" onClick={handler}>
          <span className="text-smd text-yellow text-bold">{text}</span>
        </Button>
      ))}
    </div>
  );
});

export default FarmsStakeUnstakeButtons;
