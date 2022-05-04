const reducer = (state = {
    amount: '',
    waiting: false,
    approved: false,
    approving: false,
    networkTo: null,
    networkFrom: null,
    contractService: null,
}, action) => {
    switch (action.type) {
    case "setAmount":
        return { ...state, amount: action.amount };
    case "setWaiting":
        return { ...state, waiting: action.waiting };
    case "setApproved":
        return { ...state, approved: action.approved };
    case "setApproving":
        return { ...state, approving: action.approving };
    case "setNetworkFromSelected":
        return { ...state, networkFrom: action.network };
    case "setNetworkToSelected":
        return { ...state, networkTo: action.network };
    case "setContractService":
        return { ...state, contractService: action.service };
    default:
        return state;
    }
};
export default reducer;

