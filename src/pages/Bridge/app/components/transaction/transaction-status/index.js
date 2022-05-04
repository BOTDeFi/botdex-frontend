import React from "react";
import './style.scss';

import { PulseLoader } from "react-spinners";

// import IconLink from '../../../assets/images/link_icon.svg';


const TransactionStatus = ({ status, date }) => (
    <div className='transaction-status'>
        <div className='transaction-status__status'>
            <div
                className={
                    `transaction-status__circle transaction-status__circle_${status === "IN_PROCESS" ?
                        'pending' : 'complete'}`
                }>
            </div>
            <div className='transaction-status__text'>
                <div>
                    { status === "IN_PROCESS" ? 'Swap in progress' : 'COMPLETED'}
                </div>
                <div style={{ marginBottom: '-1px' }}>
                    { status === "IN_PROCESS" ? <PulseLoader size={2} margin={1} color={'white'}/> : null}
                </div>
            </div>
        </div>
        <div className='transaction-status__date'>
            <div className='transaction-status__time'>
                { `${date.toLocaleDateString()} ${date.getHours()}:${(date.getMinutes() < 10 ? '0' : '') +
                date.getMinutes()}` }
            </div>
            {/* <div className='transaction-status__link'>
                <img className='transaction-status__img' src={IconLink} alt='transaction-status'/>
            </div> */}
        </div>
    </div>
);
export default TransactionStatus;
