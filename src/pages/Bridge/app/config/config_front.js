import LogoIMG from "../assets/images/logo.png";

import IconFacebook from '../assets/images/social/facebook.svg';
import IconInstagram from '../assets/images/social/instagram.svg';
// import IconLinkedIn from '../assets/images/social/linkedIn.svg';
// import IconMedium from '../assets/images/social/medium.svg';
import IconTelegram from '../assets/images/social/telegram.svg';
import IconTwitter from '../assets/images/social/twitter.svg';
// import IconYoutube from '../assets/images/social/youtube.svg';

const icons = [{
    icon: IconFacebook,
    link: "https://www.facebook.com/"
},
{
    icon: IconInstagram,
    link: "https://www.instagram.com/"
},
// {
//     icon: IconLinkedIn,
//     link: ""
// },
// {
//     icon: IconMedium,
//     link: ""
// },
{
    icon: IconTelegram,
    link: "https://t.me/MINATOKANJI"
},
{
    icon: IconTwitter,
    link: "https://twitter.com/"
},
// {
//     icon: IconYoutube,
//     link: ""
// }
];

let networksTo = [
    { name: "Ethereum", img: "networks/Ethereum.svg", key: "Ethereum", id: 2 },
    { name: "Binance Smart Chain", img: "networks/BSC.svg", key: "Binance-Smart-Chain", id: 1 },
    { name: "Polygon", img: "networks/Polygon.svg", key: "Polygon", id: 3 },
];

let networksFrom = [
    { name: "Ethereum", img: "networks/Ethereum.svg", key: "Ethereum", id: 2 },
    { name: "Binance Smart Chain", img: "networks/BSC.svg", key: "Binance-Smart-Chain", id: 1 },
    { name: "Polygon", img: "networks/Polygon.svg", key: "Polygon", id: 3 },
];

//field name should euqels with keys in networksTo/From.
const tokenLinks = {
    "Ethereum": {
        "testnet": {
            "link": "https://ropsten.etherscan.io/",
            "symbol": "Etherscan",
        },
        "mainnet": {
            "link": "https://etherscan.io/",
            "symbol": "Etherscan",
        }
    },
    "Binance-Smart-Chain": {
        "testnet": {
            "link": "https://testnet.bscscan.com/",
            "symbol": "Bscscan",
        },
        "mainnet": {
            "link": "https://bscscan.com/",
            "symbol": "Bscscan",
        }
    },
    "Polygon": {
        "testnet": {
            "link": "https://mumbai.polygonscan.com/",
            "symbol": "Polygonscan",
        },
        "mainnet": {
            "link": "https://explorer-mainnet.maticvigil.com/",
            "symbol": "Polygonscan",
        }
    }
};

const tokensList = [{ name: "WISH", img: "circle_icon.svg", id: 1 }];

//networks
const isEthereum = false;
const isBSC = true;
const isPolygon = true;
const Tron = false;

const isSelectToken = false;
const isProgressBar = true;
const isDestinationAddress = false;
const tokenName = "BOT";
const logoIMG = LogoIMG;
const copyright = "© Bot. All rights reserved";
const isMaxBtn = true;
const isOldFashined = false;
const isHeader = false;
const isFooter = false;

networksFrom = networksFrom.filter(item => {
    if (!isEthereum && item.key === 'Ethereum') return;
    if (!isBSC && item.key === 'Binance-Smart-Chain') return;
    if (!isPolygon && item.key === 'Polygon') return;
    if (!Tron && item.key === 'Tron') return;
    return item;
});
networksTo = networksTo.filter(item => {
    if (!isEthereum && item.key === 'Ethereum') return;
    if (!isBSC && item.key === 'Binance-Smart-Chain') return;
    if (!isPolygon && item.key === 'Polygon') return;
    if (!Tron && item.key === 'Tron') return;
    return item;
});

// console.log(networksFrom);
// console.log(networksTo);

export { networksTo, networksFrom,
    isSelectToken, isProgressBar,
    isDestinationAddress, tokensList,
    tokenName, tokenLinks, logoIMG,
    icons, copyright, isMaxBtn,
    isOldFashined, isHeader, isFooter
};
