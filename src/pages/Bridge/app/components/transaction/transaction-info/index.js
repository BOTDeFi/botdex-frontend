/* eslint-disable camelcase */
import React from "react";
import './style.scss';

import IconEthereum from '../../../assets/images/networks/Ethereum.svg';
import IconBSC from '../../../assets/images/networks/BSC.svg';
import IconPolygon from '../../../assets/images/networks/Polygon.svg';
import BigNumber from 'bignumber.js/bignumber';
import { tokenLinks } from "../../../config/config_front";
import { netType } from "../../../config/config_back";
import IconLink from '../../../assets/images/link_icon.svg';

const getNetworkData = networkId => {
    try {
        if (networkId === 1) {
            return {
                icon: IconBSC,
                symbol: 'BNB',
            };
        }
        if (networkId === 2) {
            return {
                icon: IconEthereum,
                symbol: 'ETH',
            };
        }
        if (networkId === 3) {
            return {
                icon: IconPolygon,
                symbol: 'MATIC',
            };
        }
    } catch (e) {
        console.error(e);
    }
};

const explorerLink = ({ netId, txHash }) => {
    try {
        let network;
        let link;
        switch (netId) {
        case 1:
            network = 'Binance-Smart-Chain';
            link = tokenLinks[network][netType].link;
            return `${link}tx/${txHash}`;
        case 2:
            network = 'Ethereum';
            link = tokenLinks[network][netType].link;
            return `${link}tx/${txHash}`;
        case 3:
            network = 'Polygon';
            link = tokenLinks[network][netType].link;
            return `${link}tx/${txHash}`;
        }
    } catch (e) {
        console.error(e);
    }
};

const TransactionInfo = ({ data }) => {
    const { from_network_num,
        to_network_num,
        from_tx_hash,
        to_tx_hash,
        from_amount = 0,
        to_amount = 0,
        decimals } = data;
    // const isMobile = useMedia({ minWidth: '500px' });
    const { icon: iconFrom, symbol: symbolFrom } = getNetworkData(from_network_num);
    const { icon: iconTo, symbol: symbolTo } = getNetworkData(to_network_num);
    const decimalsFrom = decimals[1];
    const decimalsTo = decimals[2];
    const newAmountFrom = new BigNumber(from_amount).dividedBy(10 ** decimalsFrom).toString(10);
    const newAmountTo = new BigNumber(to_amount).dividedBy(10 ** decimalsTo).toString(10);
    const linkFrom = explorerLink({ netId: from_network_num, txHash: from_tx_hash });
    const linkTo = explorerLink({ netId: to_network_num, txHash: to_tx_hash });
    return (
        <div className='transaction-info'>
            <div className='transaction-info__column transaction-info__lables'>
                <p className="transaction-info__title">From</p>
                <p className="transaction-info__title">To</p>
            </div>
            <div className='transaction-info__column transaction-info__network'>
                <div className='transaction-info__column-from'>
                    <img className='transaction-info__img' src={iconFrom} alt={symbolFrom}/>
                    {symbolFrom}
                </div>
                <div className='transaction-info__column-to'>
                    <img className='transaction-info__img' src={iconTo} alt={symbolTo}/>
                    {symbolTo}
                </div>
            </div>
            <div className='transaction-info__column transaction-info__hash'>
                <div className='transaction-info__column-from'>
                    <a href={linkFrom}
                        className="transaction-info__link"
                        target="_blank" rel="noreferrer">
                        <img className='transaction-status__img' src={IconLink} alt='transaction-status'/>
                        Transaction Hash
                    </a>
                </div>
                <div className='transaction-info__column-to'>
                    <a href={linkTo}
                        className="transaction-info__link"
                        target="_blank" rel="noreferrer">
                        <img className='transaction-status__img' src={IconLink} alt='transaction-status'/>
                        Transaction Hash
                    </a>
                </div>
            </div>
            <div className='transaction-info__column transaction-info__amount'>
                <div className='transaction-info__price'>{newAmountFrom}</div>
                <div className='transaction-info__price'>{isNaN(newAmountTo) ? '' : newAmountTo}</div>
            </div>
        </div>
    );
};
export default TransactionInfo;
