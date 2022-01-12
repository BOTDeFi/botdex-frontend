import React from 'react';

import VerifiedIcon from '@/assets/img/icons/check.svg';
import { DetailsBadgeType, IDetailsBadgeType } from '@/types';

interface IDetailsBadgeProps {
  type: IDetailsBadgeType;
}

const CoreBadge: React.FC = () => {
  return (
    <span className="badge-wrapper">
      <img src={VerifiedIcon} alt="verified core farm" />
      <span className="text-ssmd">Core</span>
    </span>
  );
};

const DetailsBadge: React.FC<IDetailsBadgeProps> = ({ type }) => {
  return (
    <div className="farms-table-row__details-badge box-f-ai-c">
      {type === DetailsBadgeType.core && <CoreBadge />}
    </div>
  );
};

export default DetailsBadge;
