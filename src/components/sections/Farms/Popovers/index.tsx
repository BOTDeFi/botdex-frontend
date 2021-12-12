import React from 'react';

import { withPopover } from '@/HOC/BasePopover';

import { IMultiplierPopoverProps } from './types';

export const LiquidityPopover = withPopover(
  'Total value of the funds in this farm’s liquidity pool',
);

export const MultiplierPopover: React.FC<IMultiplierPopoverProps> = React.memo(
  ({ symbol, ...props }) => {
    const Component = withPopover(
      <>
        {[
          `The Multiplier represents the proportion of ${symbol} rewards each farm receives, as a proportion of the ${symbol} produced each block.`,

          `For example, if a 1x farm received 1 ${symbol} per block, a 40x farm would receive 40 ${symbol} per block.`,

          'This amount is already included in all APR calculations for the farm.',
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
