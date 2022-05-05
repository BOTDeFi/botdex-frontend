export default {
    setPendingStateFee: data => ({
        type: 'PENDING:SET_STATE_FEE',
        payload: data
    }),
    setPendingStateMinAmount: data => ({
        type: 'PENDING:SET_STATE_AMOUNT',
        payload: data
    })
};
