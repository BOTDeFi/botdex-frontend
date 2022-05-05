import { getFromStorage } from '../../services/storage';
import config from '../../config/config_back';

const defaultNetworkFrom = getFromStorage('defaultNetworkFrom');
const networkFrom = defaultNetworkFrom ? defaultNetworkFrom : 'Polygon';

const defaultNetworkType = getFromStorage('defaultNetworkType');
const networkType = defaultNetworkType ? defaultNetworkType : config.defaultNetType;

const initialState = {
    type: 'metamask',
    networkType,
    networkFrom,
    networkTo: '',
    dexList: '',
    dex: '',
};

export default (state = initialState, { type, payload }) => {
    // console.log('redux state:', state);
    switch (type) {
    case 'WALLET:SET_TYPE': return { ...state, type: payload, };
    case 'WALLET:SET_NETWORK_TYPE': return { ...state, networkType: payload, };
    case 'WALLET:SET_NETWORK_FROM': return { ...state, networkFrom: payload, };
    case 'WALLET:SET_NETWORK_TO': return { ...state, networkTo: payload, };
    case 'WALLET:SET_DEX_LIST': return { ...state, dexList: payload, };
    case 'WALLET:SET_DEX': return { ...state, dex: payload, };
    default: return state;
    }
};
