export const setAmount = amount => dispatch => {
    dispatch({
        type: "setAmount",
        amount
    });
};

export const setWaiting = waiting => dispatch => {
    dispatch({
        type: "setWaiting",
        waiting,
    });
};

export const setApproved = approved => dispatch => {
    dispatch({
        type: "setApproved",
        approved,
    });
};

export const setApproving = approving => dispatch => {
    dispatch({
        type: "setApproving",
        approving,
    });
};

export const setNetworkToSelected = network => dispatch => {
    dispatch({
        type: "setNetworkToSelected",
        network
    });
};

export const setNetworkFromSelected = network => dispatch => {
    dispatch({
        type: "setNetworkFromSelected",
        network
    });
};

export const setContractService = service => dispatch => {
    dispatch({
        type: "setContractService",
        service
    });
};
