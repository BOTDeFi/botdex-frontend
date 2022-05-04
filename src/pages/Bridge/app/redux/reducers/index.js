import { combineReducers } from "@reduxjs/toolkit";

import notePopupReducer from "./notePopupReducer";
import progressReducer from "./progressReducer";
import modalReducer from "./modalReducer";
import formDataReducer from "./formDataReducer";
import walletReducer from "./walletReducer";
import userReducer from "./userReducer";
import pendingReducer from "./pendingReducer";
import transactionReducer from "./transactionReducer";
const reducers = combineReducers({
    notePopup: notePopupReducer,
    progress: progressReducer,
    modal: modalReducer,
    formData: formDataReducer,
    wallet: walletReducer,
    user: userReducer,
    pending: pendingReducer,
    transaction: transactionReducer,
});

export default reducers;
