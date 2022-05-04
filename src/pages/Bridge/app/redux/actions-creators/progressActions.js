export const setStepDone = (id, isDone) => dispatch => {
    dispatch({
        type: "setStepDone",
        id,
        isDone
    });
};
