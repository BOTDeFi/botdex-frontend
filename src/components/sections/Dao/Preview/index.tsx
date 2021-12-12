import React from 'react';

import Button from '@/components/atoms/Button';

import './Preview.scss';

const Preview: React.FC = () => {
  return (
    <div className="dao-preview">
      <div className="dao-preview__title h1-md text-white text-bold">DAO</div>
      <div className="dao-preview__footer-container">
        <div className="dao-preview__subtitle text text-white">
          <p>Refinery Finance Governance</p>
          <p>
            Tokenx tokens represent voting shares in Refinery Finance governance. You can vote on
            each proposal yourself or delegate your votes to a third party.
          </p>
        </div>
        <Button className="dao-preview__button" link="/dao/proposal/create">
          <span className="text-white text-smd text-bold">Create Proposal</span>
        </Button>
      </div>
    </div>
  );
};

export default Preview;
