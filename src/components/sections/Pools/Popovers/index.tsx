import React from 'react';

import { withPopover } from '@/HOC/BasePopover';

import {
  IAutoBountyPopoverProps,
  IPoolsCollectPopoverProps,
  ITotalStakedPopoverProps,
} from './types';

export const AutoFarmingPopover = withPopover(
  'Any funds you stake in this pool will be automagically harvested and restaked (compounded) for you.',
);

export const ManualFarmingPopover = withPopover(
  'You must harvest and compound your earnings from this pool manually.',
);

// ???
// export const createTotalStakedPopoverComponent = (symbol: string) => withPopover(`Total amount of ${symbol} staked in this pool`);

export const TotalStakedPopover: React.FC<ITotalStakedPopoverProps> = React.memo(
  ({ symbol, ...props }) => {
    const Component = withPopover(`Total amount of ${symbol} staked in this pool`);
    return <Component {...props} />;
  },
);

export const AutoBountyPopover: React.FC<IAutoBountyPopoverProps> = ({ symbol, fee, ...props }) => {
  const Component = withPopover(
    <>
      {[
        'This bounty is given as a reward for providing a service to other users.',

        `Whenever you successfully claim the bounty, you’re also helping out by activating the Auto ${symbol} Pool’s compounding function for everyone.`,

        `Auto-Compound Bounty: ${
          fee === null ? '###' : fee / 100
        }% of all Auto ${symbol} pool users pending yield`,
      ].map((text, index, arr) => {
        const isLast = index === arr.length - 1;
        const styles = isLast ? { className: 'text-bold' } : { style: { marginBottom: '10px' } };
        return (
          <p key={text} {...styles}>
            {text}
          </p>
        );
      })}
    </>,
  );
  return <Component {...props} />;
};

export const PoolsCollectPopover: React.FC<IPoolsCollectPopoverProps> = React.memo(
  ({ symbol, ...props }) => {
    const Component = withPopover(
      <>
        {[
          `Compound: collect and restake ${symbol} into pool.`,

          `Harvest: collect ${symbol} and send to wallet`,
        ].map((text, index, arr) => {
          const isLast = index === arr.length - 1;
          const styles = isLast ? { className: 'text-bold' } : { style: { marginBottom: '10px' } };
          return (
            <p key={text} {...styles}>
              {text}
            </p>
          );
        })}
      </>,
    );
    return <Component {...props} />;
  },
);
