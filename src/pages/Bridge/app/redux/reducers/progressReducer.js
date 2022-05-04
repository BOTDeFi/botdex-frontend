const initialState = [
    { text: "Connect wallet", isDone: false, id: 0 },
    { text: "Enter amount for approve", isDone: false, id: 1 },
    { text: "Approve to swap now", isDone: false, id: 2 },
    { text: "Swap token", isDone: false, id: 3 },
    { text: "Check the transaction progress in the swap history", isDone: false, id: 4 },
];

const reducer = (state = initialState, action) => {
    switch (action.type) {
    case "setStepDone":
        return state.map(item => {
            if (item.id <= action.id)
                item.isDone = action.isDone ? action.isDone : item.isDone;
            return item;
        });
    default:
        return state;
    }
};
export default reducer;
