import React from 'react';
import { CSSTransition } from 'react-transition-group';

import AucImg from '../../../../assets/img/sections/farms/auc.svg';
import { Button } from '../../../atoms';

import './Preview.scss';

const Preview: React.FC = React.memo(() => {
  const [isDetailsOpen, setDetailsOpen] = React.useState<boolean>(false);

  const toggleDetails = () => {
    setDetailsOpen((isOpen) => !isOpen);
  };
  const handleToggleDetailsClick = () => {
    toggleDetails();
  };
  const handleToggleDetailsKeyDown = (e: React.KeyboardEvent): void => {
    e.stopPropagation();
    e.preventDefault();
    if (e.repeat) return;
    if (e.key === 'Enter') {
      toggleDetails();
    }
  };
  return (
    <div className="farms-preview box-yellow-l-d">
      <div className="farms-preview__box">
        <h1 className="farms-preview__title h1-lg text-bold">Farms</h1>
        <div className="farms-preview__subtitle">Stake Liquidity Pool (LP) tokens to earn.</div>
      </div>
      <div className="farms-preview__auc">
        <div className="box-f-ai-c box-f-jc-sb m-box-b farms-preview__box--info">
          <div className="box-f-ai-c ">
            <img src={AucImg} alt="auction" className="farms-preview__auc-img" />
            <span className="text-upper text-bold">ACTION REQUIRED for all LP token holders</span>
          </div>
          <Button
            className="farms-preview__auc-btn"
            colorScheme="outline-purple"
            size="smd"
            arrow
            toggle
            isActive={isDetailsOpen}
            onClick={handleToggleDetailsClick}
            onKeyDown={handleToggleDetailsKeyDown}
          >
            <span className="text-med">Details</span>
          </Button>
        </div>
        <CSSTransition
          unmountOnExit
          mountOnEnter
          in={isDetailsOpen}
          addEndListener={(node, done) => {
            node.addEventListener('transitionend', done, false);
          }}
          classNames="show"
        >
          <div className="text-smd farms-preview__details">
            Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia
            consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.
          </div>
        </CSSTransition>
      </div>
    </div>
  );
});

export default Preview;
