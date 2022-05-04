const obj = {
    setWalletType: data => ({ type: 'WALLET:SET_TYPE', payload: data }),
    setWalletNetType: data => ({ type: 'WALLET:SET_NETWORK_TYPE', payload: data }),
    setWalletNetFrom: data => ({ type: 'WALLET:SET_NETWORK_FROM', payload: data }),
    setWalletNetTo: data => ({ type: 'WALLET:SET_NETWORK_TO', payload: data }),
    setWalletDexList: data => ({ type: 'WALLET:SET_DEX_LIST', payload: data }),
    setWalletDex: data => ({ type: 'WALLET:SET_DEX', payload: data }),
};
export default obj;

