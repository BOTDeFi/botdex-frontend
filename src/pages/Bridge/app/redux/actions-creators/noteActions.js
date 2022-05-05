export const addNote = text => dispatch => {
    dispatch({
        type: "addNote",
        text
    });
};

export const removeNote = id => dispatch => {
    dispatch({
        type: "removeNote",
        id
    });
};

