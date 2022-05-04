const initialState = {
    isPendingNetworks: false,
    isPendingFee: true,
    isPendingAmount: true,
};

export default (state = initialState, { type, payload }) => {
    switch (type) {
    case 'PENDING:SET_STATE_FEE':
        return { ...state, isPendingFee: payload };
    case 'PENDING:SET_STATE_AMOUNT':
        return { ...state, isPendingAmount: payload };
    default:
        return state;
    }
};
