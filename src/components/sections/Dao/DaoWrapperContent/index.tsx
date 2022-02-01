import React from 'react';
import BigNumber from 'bignumber.js/bignumber';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';

import { Skeleton } from '@/components/atoms';
import { SkeletonSixRows, SkeletonTenRows, SkeletonTwoRows } from '@/components/atoms/Skeleton';
import ReactMarkdown from '@/components/molecules/ReactMarkdown';
import { DaoInformation, DaoSection } from '@/components/sections/Dao';
import DaoProposalCastVote from '@/components/sections/Dao/DaoProposalCastVote';
import DaoProposalInformation from '@/components/sections/Dao/DaoProposalInformation';
import DaoProposalVotes, { IVote } from '@/components/sections/Dao/DaoProposalVotes';
import DaoProposalVotesResult from '@/components/sections/Dao/DaoProposalVotesResult';
import { tokens } from '@/config/tokens';
import { useProposalVotes } from '@/hooks/dao/useProposalVotes';
import { IProposal } from '@/services/api/snapshot.org/hooks';
import { useMst } from '@/store';
import { BIG_ZERO } from '@/utils/constants';

interface IDaoWrapperContentProps {
  proposal?: IProposal;
}

const DaoWrapperContentSkeleton: React.FC = React.memo(() => {
  return (
    <>
      <div className="dao__title text-black text-bold">
        <Skeleton active title paragraph={false} />
      </div>
      <section className="section document dao__section box-shadow box-white">
        <div className="document__wrapper">
          <div className="document__column">
            <SkeletonTenRows />
          </div>
          <div className="document__column information-column text-ssm">
            <div className={classNames('document__status', 'btn', 'btn-ssm', 'text-ssmd')}>
              <Skeleton active title paragraph={false} />
            </div>
            <DaoInformation className="document__information" title="Information">
              <SkeletonSixRows />
            </DaoInformation>

            <DaoInformation className="document__information" title="Current results">
              <SkeletonTwoRows />
            </DaoInformation>
          </div>
        </div>
      </section>

      <DaoSection className="dao__section" title="Cast your vote">
        <SkeletonTwoRows />
      </DaoSection>

      <DaoSection className="dao__section" title="Votes">
        <SkeletonTenRows />
      </DaoSection>
    </>
  );
});

const getPercents = (amount: BigNumber, totalAmount: BigNumber) => {
  const percents = amount.div(totalAmount).multipliedBy(100);
  const percentsRounded = percents.toFixed(2);
  return { percents, percentsRounded };
};

const DaoWrapperContent: React.FC<IDaoWrapperContentProps> = observer(({ proposal }) => {
  const {
    votes: votesRaw,
    votingPowersLoading,
    updateProposalVotes,
  } = useProposalVotes(proposal?.id);
  const { user } = useMst();

  if (!proposal) return <DaoWrapperContentSkeleton />;

  const {
    id: proposalId,
    ipfs,
    title,
    author,
    body,
    choices,
    start,
    end,
    snapshot,
    state: status,
    type: votingSystem,
  } = proposal;

  let totalChoicesVotingPower = BIG_ZERO;

  const mapChoiceToTotalVotingPower = votesRaw.reduce(
    (acc, { choice: choiceIndex, votingPower }) => {
      const choice = choices[choiceIndex - 1];
      const totalVotingPower = acc[choice] ? new BigNumber(acc[choice].votingPower) : BIG_ZERO;
      acc[choice] = {
        votingPower: totalVotingPower.plus(votingPower),
      };
      totalChoicesVotingPower = totalChoicesVotingPower.plus(votingPower);
      return acc;
    },
    {} as Record<string, { votingPower: BigNumber }>,
  );

  const results = votesRaw.length
    ? choices.map((choice) => {
        const { votingPower } = mapChoiceToTotalVotingPower[choice] || { votingPower: BIG_ZERO };
        return {
          choice,
          votingPower,
          percents: getPercents(votingPower, totalChoicesVotingPower).percentsRounded,
        };
      })
    : [];

  const votes = votesRaw.map(({ id: voteId, voter, choice: choiceIndex, votingPower }) => {
    return {
      voteId,
      person: {
        address: voter,
      },
      choice: choices[choiceIndex - 1],
      votingPower,
    } as IVote;
  });

  const hasConnectedWallet = Boolean(user.address);
  const hasAlreadyVoted = votesRaw.some(({ voter }) => voter === user.address);

  return (
    <>
      <div className="dao__title text-black text-bold">{title}</div>
      <section className="section document dao__section box-shadow box-white">
        <div className="document__wrapper">
          <div className="document__column">
            <ReactMarkdown className="document__text text-black">{body}</ReactMarkdown>
          </div>
          <div className="document__column information-column text-ssm">
            <div
              className={classNames(
                'document__status',
                `document__status_${status}`,
                'btn',
                'btn-ssm',
                'text-ssmd',
              )}
            >
              {status}
            </div>
            <DaoInformation className="document__information" title="Information">
              <DaoProposalInformation
                ipfs={ipfs}
                author={author}
                start={start}
                end={end}
                snapshot={snapshot}
                votingSystem={votingSystem}
              />
            </DaoInformation>

            <DaoInformation className="document__information" title="Current results">
              <SkeletonTwoRows loading={votingPowersLoading}>
                <DaoProposalVotesResult results={results} />
              </SkeletonTwoRows>
            </DaoInformation>
          </div>
        </div>
      </section>

      {status === 'active' && hasConnectedWallet && !hasAlreadyVoted && (
        <DaoSection className="dao__section" title="Cast your vote">
          <SkeletonTwoRows loading={votingPowersLoading}>
            <DaoProposalCastVote
              proposalId={proposalId}
              choices={choices}
              onVote={updateProposalVotes}
            />
          </SkeletonTwoRows>
        </DaoSection>
      )}

      {status !== 'pending' && (
        <DaoSection className="dao__section" title="Votes">
          <SkeletonTenRows loading={votingPowersLoading}>
            <DaoProposalVotes votes={votes} token={tokens.rp1} />
          </SkeletonTenRows>
        </DaoSection>
      )}
    </>
  );
});

export default DaoWrapperContent;
