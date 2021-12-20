import React, { useMemo } from 'react';

import { Button } from '@/components/atoms';
import { IPoolFarmingMode, PoolFarmingMode } from '@/types';

interface ICollectButtonProps {
  farmMode: IPoolFarmingMode;
  value: number;
  collectHandler: () => void;
}

const CollectButton: React.FC<ICollectButtonProps> = ({ farmMode, value, collectHandler }) => {
  const buttonText = useMemo(() => {
    if (farmMode === PoolFarmingMode.manual) return 'Collect';
    return 'Harvest';
  }, [farmMode]);
  return (
    <Button
      colorScheme="yellow"
      size="ssm"
      disabled={value === 0}
      onClick={
        value === 0
          ? undefined
          : () => {
              collectHandler();
            }
      }
    >
      <span className="text-white text-ssmd text-bold">{buttonText}</span>
    </Button>
  );
};

export default CollectButton;
