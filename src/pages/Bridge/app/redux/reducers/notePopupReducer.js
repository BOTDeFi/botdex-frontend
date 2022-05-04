const generateId = () => '_' + Math.random().toString(36).substr(2, 9);

const reducer = (state = [], action) => {
    switch (action.type) {
    case "addNote":
        return [...state, { text: action.text, id: generateId() }];
    case "removeNote":
        return state.filter(item => item.id !== action.id);
    default:
        return state;
    }
};
export default reducer;
