const reducer = (state = {
    isWalletModalOpen: false,
    isOpen: false,
    text: '',
    image: '',
}, action) => {
    switch (action.type) {
    case "toggleChooseWalletModal":
        return { ...state, isWalletModalOpen: !state.isWalletModalOpen };
    case "MODAL:TOGGLE":
        return {
            ...state,
            ...action.payload
        };
    default:
        return state;
    }
};

export default reducer;
