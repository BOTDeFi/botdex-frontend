export const setValidationWallet = status => dispatch => {
    dispatch({
        type: "setValidationWallet",
        status
    });
};
export const setValidationAmount = status => dispatch => {
    dispatch({
        type: "setValidationAmount",
        status
    });
};
export const setValidationDestination = status => dispatch => {
    dispatch({
        type: "setValidationDestination",
        status
    });
};
export const setValidationToken = status => dispatch => {
    dispatch({
        type: "setValidationToken",
        status
    });
};

export const setValidForm = status => dispatch => {
    dispatch({
        type: "setValidForm",
        status
    });
};
