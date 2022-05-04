import React from 'react';
// import mock from "./mock";
import './style.scss';
import { useSelector } from 'react-redux';
import ProgressPoint from './progress-point';
import { ShadowTitle } from '@/components/atoms';
const Progressbar = () => {
    const steps = useSelector(state => state.progress);
    return (
        <div className='progressbar'>
            <div className="progressbar__title">
                <ShadowTitle type="h2">
                    Progress outline
                </ShadowTitle>
            </div>
            <ul className="progressbar__list">
                {
                    steps.map((item, index) => (
                        <ProgressPoint text={item.text}
                            isDone={item.isDone}
                            number={index}
                            last={index === steps.length - 1}
                            key={index}/>)
                    )
                }
            </ul>
        </div>
    );
};
export default Progressbar;
