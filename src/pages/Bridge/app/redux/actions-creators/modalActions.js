export const toggleChooseWalletModal = () => dispatch => {
    dispatch({
        type: "toggleChooseWalletModal"
    });
};

export const toggleAlertModal = data => dispatch => {
    dispatch({
        type: "MODAL:TOGGLE",
        payload: data,
    });
};

