import React from 'react';

import OpenLink from '@/components/sections/Farms/OpenLink';
import { useScannerUrl } from '@/hooks/useScannerUrl';
import { getAddress } from '@/services/web3/contractHelpers';
import { Farm } from '@/types';
import { getAddLiquidityUrl } from '@/utils/urlConstructors';

import DetailsBadge from '../DetailsBadge';

interface IDetailsLinksProps {
  farm: Farm;
}

const DetailsLinks: React.FC<IDetailsLinksProps> = ({ farm }) => {
  const { lpSymbol, quoteToken, token, lpAddresses, multiplier, categoryType } = farm;
  const lpAddress = getAddress(lpAddresses);
  const viewContractLink = useScannerUrl(`address/${lpAddress}`);
  const isActiveFarm = multiplier !== '0X';
  const getLpRow = isActiveFarm
    ? [
        // TODO: correct redirect to Add Liquidity with initializing add liquidity
        {
          href: getAddLiquidityUrl(quoteToken, token),
          text: `Get ${lpSymbol}`,
        },
      ]
    : [];
  const links = [
    ...getLpRow,
    {
      href: viewContractLink,
      text: 'View Contract',
    },
    // TODO: correct redirect to pair info
    {
      href: viewContractLink, // `/pool/${lpAddress}`,
      text: 'See Pair Info',
    },
  ];
  return (
    <div className="farms-table-row__details-links">
      {links.map(({ href, text }) => (
        <OpenLink
          key={href + text}
          className="farms-table-row__details-links-item"
          href={href}
          text={text}
        />
      ))}
      <DetailsBadge type={categoryType} />
    </div>
  );
};

export default DetailsLinks;
