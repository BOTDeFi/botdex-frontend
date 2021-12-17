import React, { useState } from 'react';
import classNames from 'classnames';

import Button from '@/components/atoms/Button';
import { useCastVote } from '@/hooks/dao/useCastVote';

import './DaoProposalCastVote.scss';

interface IDaoProposalCastVoteProps {
  proposalId: string;
  choices: string[];
  onVote: () => void;
}

const DaoProposalCastVote: React.FC<IDaoProposalCastVoteProps> = ({
  proposalId,
  choices,
  onVote,
}) => {
  const [pendingTx, setPendingTx] = useState(false);
  const [votedOption, setVotedOption] = useState(-1);

  const { vote } = useCastVote({
    onSuccessTx: onVote,
    onStartTx: () => setPendingTx(true),
    onEndTx: () => setPendingTx(false),
  });

  const voteHandler = () => {
    vote(proposalId, choices, votedOption);
  };

  const votingDisabled = pendingTx || votedOption === -1;

  return (
    <div className="buttons-group">
      {choices.map((choice, index) => {
        const choiceIndex = index + 1;
        return (
          <Button
            key={choice + String(index)}
            className={classNames('buttons-group__button', {
              'buttons-group__button_active': votedOption === choiceIndex,
            })}
            colorScheme="outline-purple"
            size="smd"
            onClick={() => setVotedOption(choiceIndex)}
          >
            {choice}
          </Button>
        );
      })}
      <Button
        className="buttons-group__submit-button"
        loading={pendingTx}
        disabled={votingDisabled}
        colorScheme="purple"
        onClick={votingDisabled ? undefined : voteHandler}
      >
        <span className="text-bold">Vote</span>
      </Button>
    </div>
  );
};

export default DaoProposalCastVote;
