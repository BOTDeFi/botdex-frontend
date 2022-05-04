const obj = {
    setUserData: data => ({
        type: 'USER:SET_DATA',
        payload: data
    }),
    setSwapMsg: data => ({
        type: 'USER:SET_SWAP_MSG',
        payload: data
    }),
    setSwapStatus: data => ({
        type: 'USER:SET_SWAP_STATUS',
        payload: data
    }),
    setTransactionInfo: data => ({
        type: 'USER:SET_TRANSACTION_INFO',
        payload: data
    })
};
export default obj;
