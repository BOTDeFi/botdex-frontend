const IS_PRODUCTION = true;
const IS_USING_DEV_SERVER = false;
const bridgeLinkApi = `https://bridge.botpla.net/api/v1`;

export const netType = IS_PRODUCTION ? "mainnet" : "testnet";

export default {
    IS_PRODUCTION,
    defaultNetType: IS_PRODUCTION ? 'mainnet' : 'testnet',
    serverDomain() {
        if (this.IS_PRODUCTION) {
            return bridgeLinkApi;
        } else if (IS_USING_DEV_SERVER) {
            return bridgeLinkApi;
        } else {
            return bridgeLinkApi;
        }
    },
    links: {
        twitter: "",
        telegram: "",
        medium: "",
        github: "",
        reddit: "",
        discord: "",
        email: "",
        policy: "",
    },
    tokenLinks() {
        return {
            ethereum: {
                mainnet: "https://etherscan.io",
                testnet: "https://ropsten.etherscan.io",
            },
            binanceSmartChain: {
                mainnet: "https://bscscan.com",
                testnet: "https://testnet.bscscan.com",
            },
            binanceChain: {
                mainnet: "https://explorer.binance.org",
                testnet: "https://testnet-explorer.binance.org",
            },
            polygon: {
                mainnet: "https://explorer-mainnet.maticvigil.com",
                testnet: "https://mumbai.polygonscan.com",
            },
            tron: {
                mainnet: "https://tronscan.org",
                testnet: "https://nile.tronscan.org"
            }
        };
    },
    chainIds: {
        mainnet: {
            Ethereum: {
                name: "Mainnet",
                key: "Ethereum",
                id: [1, "0x1", "0x01"],
                nativeCurrency: { name: 'ETH', decimals: 18, symbol: 'ETH' },
                rpcUrls: ['https://mainnet.infura.io/v3/'],
            },
            "Binance-Smart-Chain": {
                name: "Binance smart chain",
                key: "Binance-Smart-Chain",
                id: [56, "0x38"],
                nativeCurrency: { name: 'BSC', decimals: 18, symbol: 'BSC' },
                rpcUrls: ['https://bsc-dataseed1.defibit.io/'],
            },
            Polygon: {
                name: 'Polygon Mainnet',
                key: 'Polygon',
                id: [137, '0x89'],
                nativeCurrency: { name: 'POLYGON', decimals: 18, symbol: 'MATIC' },
                rpcUrls: ['https://rpc-mainnet.maticvigil.com'],
            },
        },
        testnet: {
            Ethereum: {
                name: "Ropsten testnet",
                key: 'Ethereum',
                id: [3, "0x3"],
                nativeCurrency: { name: 'rETH', decimals: 18, symbol: 'rETH' },
                rpcUrls: ['https://ropsten.infura.io/v3/'],
            },
            "Binance-Smart-Chain": {
                name: "Binance smart chain testnet",
                key: 'Binance-Smart-Chain',
                id: [97, "0x61"],
                nativeCurrency: { name: 'BSC', decimals: 18, symbol: 'BSC' },
                rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
            },
            Polygon: {
                name: 'Mumbai Testnet',
                key: 'Polygon',
                id: [80001, '0x13881'],
                nativeCurrency: { name: 'POLYGON', decimals: 18, symbol: 'MATIC' },
                rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
            },
            Tron: {
                name: 'TronLink',
                key: 'Tron',
                id: ['https://event.nileex.io'],
                nativeCurrency: { name: 'TRX', decimals: 18, symbol: 'TRX' },
                rpcUrls: [''],
            },
        },
    },
};
