
export const setToStorage = (key, object) => {
    localStorage.setItem(key, JSON.stringify(object));
};

export const getFromStorage = key => {
    const object = JSON.parse(localStorage.getItem(key));
    return object;
};

