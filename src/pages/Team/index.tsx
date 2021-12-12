import React from 'react';
import { useLocation } from 'react-router-dom';

import { clog } from '@/utils/logger';

import { ITeamCard } from '../../types';

const Team: React.FC = () => {
  const location = useLocation();

  const [teamData, setTeamData] = React.useState<ITeamCard | unknown>(undefined);
  clog(teamData);

  React.useEffect(() => {
    if (location.state) {
      setTeamData(location.state);
    }
  }, [location]);

  return (
    <main className="team">
      <div className="row">1</div>
    </main>
  );
};

export default Team;
