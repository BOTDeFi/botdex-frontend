import React from 'react';

import OpenLink from '@/components/atoms/OpenLink';
import { useScannerUrl } from '@/hooks/useScannerUrl';
import { getIpfsUrl } from '@/services/api/snapshot.org';
import { IProposal } from '@/services/api/snapshot.org/hooks';
import { ProposalVotingSystem } from '@/services/api/snapshot.org/types';
import { addressShortener, ipfsShortener, numberWithCommas } from '@/utils/formatters';

import './DaoProposalInformation.scss';

interface IDaoProposalInformationProps {
  ipfs: IProposal['ipfs'];
  author: IProposal['author'];
  start: IProposal['start'];
  end: IProposal['end'];
  snapshot: IProposal['snapshot'];
  votingSystem: IProposal['type'];
}

const getHumanFriendlyVotingSystem = (votingSystem: ProposalVotingSystem) => {
  switch (votingSystem) {
    default: {
      return 'Single choice voting';
    }
  }
};
const getHumanFriendlyDateTime = (timestamp: number) => {
  const date = new Date(timestamp * 1e3);
  const dateAsString = date.toLocaleDateString();
  const timeAsString = date.toLocaleTimeString();
  const timeAsArray = timeAsString.split(':');
  timeAsArray.splice(-1); // get rid of seconds
  return `${dateAsString}, ${timeAsArray.join(':')}`;
};

const additionalInformation = [
  // {
  //   option: 'Strategie(s)',
  // },
  {
    option: 'Author',
  },
  {
    option: 'IPFS',
  },
  {
    option: 'Voting system',
  },
  {
    option: 'Start date',
  },
  {
    option: 'End date',
  },
  {
    option: 'Snapshot',
  },
];

const DaoProposalInformation: React.FC<IDaoProposalInformationProps> = ({
  ipfs,
  author,
  start,
  end,
  snapshot,
  votingSystem,
}) => {
  const addressUrl = useScannerUrl(`address/${author}`);
  const snapshotUrl = useScannerUrl(`block/${snapshot}`);
  const ipfsUrl = getIpfsUrl(ipfs);
  const additionalInformationValues = [
    // '',
    <OpenLink
      href={addressUrl}
      text={addressShortener(author)}
      iconClassName="additional-information__link-icon"
    />,
    <OpenLink
      href={ipfsUrl}
      text={ipfsShortener(ipfs)}
      iconClassName="additional-information__link-icon"
    />,
    getHumanFriendlyVotingSystem(votingSystem),
    getHumanFriendlyDateTime(start),
    getHumanFriendlyDateTime(end),
    <OpenLink
      href={snapshotUrl}
      text={numberWithCommas(Number(snapshot))}
      iconClassName="additional-information__link-icon"
    />,
  ];
  return (
    <ul>
      {additionalInformation.map(({ option }, index) => {
        return (
          <li key={option} className="additional-information__content-row">
            <div className="additional-information__option-name text-black">{option}</div>
            <div className="additional-information__option-value">
              {additionalInformationValues[index]}
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default DaoProposalInformation;
