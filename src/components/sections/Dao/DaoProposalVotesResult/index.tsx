import React from 'react';
import BigNumber from 'bignumber.js/bignumber';

import './DaoProposalVotesResult.scss';

interface IDaoProposalVotesResult {
  choice: string;
  votingPower: BigNumber;
  percents: string;
}

interface IDaoProposalVotesResultProps {
  results: IDaoProposalVotesResult[];
}

const DaoProposalVotesResult: React.FC<IDaoProposalVotesResultProps> = ({ results }) => {
  return (
    <ul className="votes-progression">
      {results.map(({ choice, percents }) => {
        return (
          <li key={choice + percents} className="votes-progression__item">
            <div className="votes-progression__captions text-yellow">
              <div className="votes-progression__option">{choice}</div>
              <div className="votes-progression__value">{percents}%</div>
            </div>
            <div className="votes-progression__progress-bar">
              <div
                style={{ width: `${Number(percents)}%` }}
                className="votes-progression__progress-bar-value"
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default DaoProposalVotesResult;
