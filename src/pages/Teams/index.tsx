import React from 'react';

import TeamImg from '../../assets/img/sections/teams/team-1.svg';
import { TeamCard, TeamsPreview } from '../../components/sections/Teams';

import './Teams.scss';

const Teams: React.FC = () => {
  const teams = [
    {
      name: 'Syrup Storm',
      details: "The storm's a-comin! Watch out! These bulls are stampeding in a syrupy surge!",
      members: 41115,
      win: 0,
      img: TeamImg,
    },
    {
      name: 'Syrup Storm1',
      details: "The storm's a-comin! Watch out! These bulls are stampeding in a syrupy surge!1",
      members: 41115,
      win: 0,
      img: TeamImg,
    },
  ];
  return (
    <main className="teams">
      <div className="row">
        <TeamsPreview />
        <div className="teams__content">
          {teams.map((team, index) => (
            <TeamCard key={team.name} {...team} place={index + 1} id={index} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default Teams;
