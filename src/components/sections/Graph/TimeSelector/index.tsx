/* eslint-disable react/react-in-jsx-scope */
import { VFC } from 'react';

import { Button } from '@/components/atoms';

import './TimeSelector.scss';

export type TTimestampSelector = {
  text: string;
  onClick: (...args: any) => void;
  key?: any;
};

interface ITimeSelectorProps {
  selectors: TTimestampSelector[];
  currentSelector: number;
}

/**
 * @param {TTimestampSelector[]} selectors - buttons which provides timestamps
 * @param {number} currentSelector - id of the selected timestamp
 * @returns {ReactElement} - react component with selectors of timestamps
 */

const TimeSelector: VFC<ITimeSelectorProps> = ({ selectors, currentSelector }) => {
  return (
    <section className="time-selector__body">
      {selectors.map((s: TTimestampSelector, i: number) => (
        <Button
          className={`time-selector__body-btn ${
            currentSelector === i || currentSelector === s.key ? 'selected' : ''
          }`}
          key={s.key || s.text}
          onClick={s.onClick}
        >
          {s.text}
        </Button>
      ))}
    </section>
  );
};

export default TimeSelector;
