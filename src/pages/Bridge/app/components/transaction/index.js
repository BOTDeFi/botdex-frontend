import React from "react";
import './style.scss';
import TransactionStatus from "./transaction-status";
import TransactionInfo from "./transaction-info";
import { useSelector } from 'react-redux';
import backendService from "../../services/backend";

const Transaction = () => {
    // const date = new Date().toDateString();
    const { dex, networkType } = useSelector(({ wallet }) => wallet);
    const [swapHistory, setSwapHistory] = React.useState([]);
    const [decimals, setDecimals] = React.useState({});
    const [isSwapHistoryEmpty, setSwapHistoryEmpty] = React.useState(true);
    const { address: userAddress } = useSelector(({ user }) => user);
    const getDecimals = async () => {
        try {
            if (!dex) return;
            const token1 = dex.tokens.filter(item => item.network === 'Polygon')[0];
            const token2 = dex.tokens.filter(item => item.network === 'Binance-Smart-Chain')[0];
            const decimalsNew = {
                1: token1.decimals,
                2: token2.decimals,
            };
            setDecimals(decimalsNew);
        } catch (e) {
            console.error(e);
        }
    };

    const getSwapHistory = async () => {
        try {
            if (!userAddress) return;
            const resultGetSwapHistory = await backendService.getSwapHistory(userAddress);
            const newSwapHistory = resultGetSwapHistory[networkType];
            setSwapHistory(newSwapHistory[newSwapHistory.length - 1]);
        } catch (e) {
            console.error(e);
        }
    };

    React.useEffect(() => {
        getDecimals();
        if (swapHistory) {
            setSwapHistoryEmpty(swapHistory.length === 0);
        } else {
            setSwapHistoryEmpty(true);
        }
    }, [userAddress, dex]);

    React.useEffect(() => {
        if (!userAddress) return;
        const interval = setInterval(getSwapHistory, 5000);
        getSwapHistory();
        return () => clearInterval(interval);
    }, [decimals]);

    React.useEffect(() => {
        if (swapHistory) {
            setSwapHistoryEmpty(swapHistory.length === 0);
        } else {
            setSwapHistoryEmpty(true);
        }
    }, [swapHistory]);

    return (
        <div className='transaction'>
            <div className='transaction__title'>
            latest transaction
            </div>
            <div className='transaction__container'>{
                userAddress ?
                    !isSwapHistoryEmpty ? (
                        <>
                            <TransactionStatus status={swapHistory.status}
                                date={new Date(swapHistory.created_at)}/>
                            <TransactionInfo data={{ ...swapHistory, decimals }} />
                        </>
                    ) :
                        <p className="transaction__empty">
                        NO LATEST TRANSACTIONS YET
                        </p> :
                    <p className="transaction__empty">
                    Connect wallet to see recent transactions
                    </p>
            }
            </div>
        </div>
    );
};
export default Transaction;
