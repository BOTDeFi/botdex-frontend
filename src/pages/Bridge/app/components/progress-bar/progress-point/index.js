import React from 'react';
import './style.scss';

import DoneIcon from '../../../assets/images/done_icon.svg';

const ProgressPoint = ({ text, number, last = false, isDone }) => (
    <li className={`progress-point${isDone ? ' progress-point_done' : ''}`}>
        <div className="progress-point__wrapper">
            <div className="progress-point__circle">
                <span className='progress-point__number'>{ number + 1 }</span>
                <img className="progress-point__done" src={ DoneIcon } />
            </div>
            <p className="progress-point__text">
                { text }
            </p>
        </div>
        {
            !last ?  (
                <span className='progress-point__line'></span>
            ) : null
        }
    </li>
);
export default ProgressPoint;
