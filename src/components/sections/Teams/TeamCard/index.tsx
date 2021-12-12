import React from 'react';
import cn from 'classnames';

import MemberImg from '@/assets/img/icons/member.svg';
import WinImg from '@/assets/img/icons/win-cup.svg';
import { Button } from '@/components/atoms';
import { numberWithCommas } from '@/utils/formatters';

import './TeamCard.scss';

interface ITeamCard {
  place: number;
  name: string;
  details: string;
  members: number;
  win: number;
  img: string;
  id: number | string;
}

const TeamCard: React.FC<ITeamCard> = (props) => {
  return (
    <div className="teams-card box-shadow box-f-ai-c box-f-jc-sb">
      <div className="box-f">
        <div
          className={cn('teams-card__numb box-f-c', {
            active: props.place === 1,
          })}
        >
          <span className="text-bold text-smd">{props.place}.</span>
        </div>
        <div>
          <div className="text-black text-bold text-slg">{props.name}</div>
          <div className="teams-card__details text-smd text-black">{props.details}</div>
          <div className="box-f-ai-c">
            <div className="teams-card__elem box-f-ai-c">
              <img src={WinImg} alt="" />
              <span className="text-bold text-slg text-black">{props.win}</span>
            </div>
            <div className="teams-card__elem box-f-ai-c">
              <img src={MemberImg} alt="" />
              <span className="text-bold text-slg text-black">
                {numberWithCommas(props.members)}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="box-f-ai-c">
        <Button
          colorScheme="outline-purple"
          size="smd"
          link={{
            pathname: `/team/${props.id}`,
            state: props,
          }}
        >
          <span>See more</span>
        </Button>
        <div className="teams-card__img">
          <img src={props.img} alt="" />
        </div>
      </div>
    </div>
  );
};

export default TeamCard;
