import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { observer } from 'mobx-react-lite';

import { DaoPreview, DaoWrapper } from '@/components/sections/Dao';
import DaoWrapperContent from '@/components/sections/Dao/DaoWrapperContent';
import { useGetProposal } from '@/services/api/snapshot.org/hooks';

import './Dao.scss';

const Dao: React.FC = observer(() => {
  const { id: proposalId } = useParams() as { id?: string };

  const {
    getProposal,
    options: [, { data: proposalData }],
  } = useGetProposal();

  useEffect(() => {
    if (proposalId) {
      getProposal(proposalId);
    }
  }, [proposalId, getProposal]);

  return (
    <DaoWrapper>
      <DaoPreview />
      <div className="dao__wrapper">
        <DaoWrapperContent proposal={proposalData?.proposal} />
      </div>
    </DaoWrapper>
  );
});
export default Dao;
