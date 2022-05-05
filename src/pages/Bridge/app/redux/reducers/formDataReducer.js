const reducer = (state = {
    isWalletValid: false,
    isAmountValid: false,
    isDestinationValid: false,
    isTokenValid: true,
    isValidForm: false,
    // amount: '',
}, action) => {
    switch (action.type) {
    case "setValidationWallet":
        return { ...state, isWalletValid: action.status };
    case "setValidationAmount":
        return { ...state, isAmountValid: action.status };
    case "setValidationDestination":
        return { ...state, isDestinationValid: action.status };
    case "setValidationToken":
        return { ...state, isTokenValid: action.status };
    case "setValidForm":
        return { ...state, isValidForm: action.status };
    default:
        return state;
    }
};

export default reducer;
