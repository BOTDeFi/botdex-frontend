import React, { useState } from 'react';
import { CSSTransition } from 'react-transition-group';

import { Button } from '@/components/atoms';
import FarmingModeStatus from '@/components/sections/Pools/FarmingModeStatus';
import { AutoFarmingPopover, ManualFarmingPopover } from '@/components/sections/Pools/Popovers';
import { IPoolFarmingMode, Pool, PoolFarmingMode } from '@/types';

import CardDetails from './CardDetails';

interface ICardFooterProps {
  farmMode: IPoolFarmingMode;
  pool: Pool;
}

const CardFooter: React.FC<ICardFooterProps> = React.memo(({ farmMode, pool }) => {
  const [isDetailsOpen, setDetailsOpen] = useState(false);
  return (
    <div className="p-card__footer p-card__box">
      <div className="box-f-ai-c box-f-jc-sb">
        <FarmingModeStatus type={farmMode} />
        {farmMode === PoolFarmingMode.auto ? (
          <AutoFarmingPopover className="p-card__footer-info-popover" />
        ) : (
          <ManualFarmingPopover className="p-card__footer-info-popover" />
        )}
        <Button
          toggle
          size="smd"
          colorScheme="outline-purple"
          arrow
          isActive={isDetailsOpen}
          onToggle={(value) => setDetailsOpen(value)}
        >
          <span className="text text-med text-black">{isDetailsOpen ? 'Hide' : 'Details'}</span>
        </Button>
      </div>
      <CSSTransition
        unmountOnExit
        mountOnEnter
        in={isDetailsOpen}
        addEndListener={(node, done) => {
          node.addEventListener('transitionend', done, false);
        }}
        classNames="show"
      >
        <CardDetails pool={pool} type={farmMode} />
      </CSSTransition>
    </div>
  );
});

export default CardFooter;
