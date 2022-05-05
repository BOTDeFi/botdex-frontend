const initialState = {
    address: '',
    receiver: '',
    errorMsg: '',
    errorCode: 0,
    network: '',
};

export default (state = initialState, { type, payload }) => {
    switch (type) {
    case 'USER:SET_DATA':
        return JSON.parse(JSON.stringify({
            ...state,
            ...payload
        }));
    default:
        return state;
    }
};

