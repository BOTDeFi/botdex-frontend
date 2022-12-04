import {
  BOT,
  BotdexStaking,
  MasterBotdex,
  // MasterRefiner,
  Multicall,
  RefineryVault,
  RocketFactory,
  RocketPropellant,
  RouterBotdex,
  SmartRefinerInitializable,
} from './abi';

// all of the current contracts are in 42 network
export const IS_PRODUCTION = true;

export const contracts = {
  ROUTER: {
    ADDRESS: IS_PRODUCTION
      // BotdexRouter: 0x85AEEb6e66Bc66cc4f59be59ce60cFC078dfDaFd
      // PancakeRouter (V2): 0x10ED43C718714eb63d5aA57B78B54704E256024E
      ? '0x10ED43C718714eb63d5aA57B78B54704E256024E'
      : '0x0000000000000000000000000000000000000000',
    ABI: RouterBotdex,
  },
  FACTORY: {
    ADDRESS: IS_PRODUCTION
      // BotdexFactory: 0xCA71c53f10Bd4629081C052429F9D2D555E2B53f
      // PancakeFactory (V2): 0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73
      ? '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73'
      : '0x0000000000000000000000000000000000000000',
    ABI: RocketFactory,
  },
  ERC20: {
    ABI: [
      {
        constant: true,
        inputs: [],
        name: 'name',
        outputs: [{ name: '', type: 'string' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: false,
        inputs: [
          { name: 'guy', type: 'address' },
          { name: 'wad', type: 'uint256' },
        ],
        name: 'approve',
        outputs: [{ name: '', type: 'bool' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'totalSupply',
        outputs: [{ name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: false,
        inputs: [
          { name: 'src', type: 'address' },
          { name: 'dst', type: 'address' },
          { name: 'wad', type: 'uint256' },
        ],
        name: 'transferFrom',
        outputs: [{ name: '', type: 'bool' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: false,
        inputs: [{ name: 'wad', type: 'uint256' }],
        name: 'withdraw',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'decimals',
        outputs: [{ name: '', type: 'uint8' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [{ name: '', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'symbol',
        outputs: [{ name: '', type: 'string' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: false,
        inputs: [
          { name: 'dst', type: 'address' },
          { name: 'wad', type: 'uint256' },
        ],
        name: 'transfer',
        outputs: [{ name: '', type: 'bool' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: false,
        inputs: [],
        name: 'deposit',
        outputs: [],
        payable: true,
        stateMutability: 'payable',
        type: 'function',
      },
      {
        constant: true,
        inputs: [
          { name: '', type: 'address' },
          { name: '', type: 'address' },
        ],
        name: 'allowance',
        outputs: [{ name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      { payable: true, stateMutability: 'payable', type: 'fallback' },
      {
        anonymous: false,
        inputs: [
          { indexed: true, name: 'src', type: 'address' },
          { indexed: true, name: 'guy', type: 'address' },
          { indexed: false, name: 'wad', type: 'uint256' },
        ],
        name: 'Approval',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, name: 'src', type: 'address' },
          { indexed: true, name: 'dst', type: 'address' },
          { indexed: false, name: 'wad', type: 'uint256' },
        ],
        name: 'Transfer',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, name: 'dst', type: 'address' },
          { indexed: false, name: 'wad', type: 'uint256' },
        ],
        name: 'Deposit',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, name: 'src', type: 'address' },
          { indexed: false, name: 'wad', type: 'uint256' },
        ],
        name: 'Withdrawal',
        type: 'event',
      },
    ],
  },
  PAIR: {
    ADDRESS: '0x92e999CCB3A368678422e5814ABdD177700ccf93',
    ABI: [
      { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
      {
        anonymous: false,
        inputs: [
          { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
          { indexed: true, internalType: 'address', name: 'spender', type: 'address' },
          { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
        ],
        name: 'Approval',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, internalType: 'address', name: 'sender', type: 'address' },
          { indexed: false, internalType: 'uint256', name: 'amount0', type: 'uint256' },
          { indexed: false, internalType: 'uint256', name: 'amount1', type: 'uint256' },
          { indexed: true, internalType: 'address', name: 'to', type: 'address' },
        ],
        name: 'Burn',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, internalType: 'address', name: 'sender', type: 'address' },
          { indexed: false, internalType: 'uint256', name: 'amount0', type: 'uint256' },
          { indexed: false, internalType: 'uint256', name: 'amount1', type: 'uint256' },
        ],
        name: 'Mint',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, internalType: 'address', name: 'sender', type: 'address' },
          { indexed: false, internalType: 'uint256', name: 'amount0In', type: 'uint256' },
          { indexed: false, internalType: 'uint256', name: 'amount1In', type: 'uint256' },
          { indexed: false, internalType: 'uint256', name: 'amount0Out', type: 'uint256' },
          { indexed: false, internalType: 'uint256', name: 'amount1Out', type: 'uint256' },
          { indexed: true, internalType: 'address', name: 'to', type: 'address' },
        ],
        name: 'Swap',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          { indexed: false, internalType: 'uint112', name: 'reserve0', type: 'uint112' },
          { indexed: false, internalType: 'uint112', name: 'reserve1', type: 'uint112' },
        ],
        name: 'Sync',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, internalType: 'address', name: 'from', type: 'address' },
          { indexed: true, internalType: 'address', name: 'to', type: 'address' },
          { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
        ],
        name: 'Transfer',
        type: 'event',
      },
      {
        inputs: [],
        name: 'DOMAIN_SEPARATOR',
        outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'MINIMUM_LIQUIDITY',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'PERMIT_TYPEHASH',
        outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: '', type: 'address' },
          { internalType: 'address', name: '', type: 'address' },
        ],
        name: 'allowance',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: 'spender', type: 'address' },
          { internalType: 'uint256', name: 'value', type: 'uint256' },
        ],
        name: 'approve',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [{ internalType: 'address', name: '', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [{ internalType: 'address', name: 'to', type: 'address' }],
        name: 'burn',
        outputs: [
          { internalType: 'uint256', name: 'amount0', type: 'uint256' },
          { internalType: 'uint256', name: 'amount1', type: 'uint256' },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [],
        name: 'decimals',
        outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'factory',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'getReserves',
        outputs: [
          { internalType: 'uint112', name: '_reserve0', type: 'uint112' },
          { internalType: 'uint112', name: '_reserve1', type: 'uint112' },
          { internalType: 'uint32', name: '_blockTimestampLast', type: 'uint32' },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: '_token0', type: 'address' },
          { internalType: 'address', name: '_token1', type: 'address' },
        ],
        name: 'initialize',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [],
        name: 'kLast',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [{ internalType: 'address', name: 'to', type: 'address' }],
        name: 'mint',
        outputs: [{ internalType: 'uint256', name: 'liquidity', type: 'uint256' }],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [],
        name: 'name',
        outputs: [{ internalType: 'string', name: '', type: 'string' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [{ internalType: 'address', name: '', type: 'address' }],
        name: 'nonces',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: 'owner', type: 'address' },
          { internalType: 'address', name: 'spender', type: 'address' },
          { internalType: 'uint256', name: 'value', type: 'uint256' },
          { internalType: 'uint256', name: 'deadline', type: 'uint256' },
          { internalType: 'uint8', name: 'v', type: 'uint8' },
          { internalType: 'bytes32', name: 'r', type: 'bytes32' },
          { internalType: 'bytes32', name: 's', type: 'bytes32' },
        ],
        name: 'permit',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [],
        name: 'price0CumulativeLast',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'price1CumulativeLast',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [{ internalType: 'address', name: 'to', type: 'address' }],
        name: 'skim',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'uint256', name: 'amount0Out', type: 'uint256' },
          { internalType: 'uint256', name: 'amount1Out', type: 'uint256' },
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'bytes', name: 'data', type: 'bytes' },
        ],
        name: 'swap',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [],
        name: 'symbol',
        outputs: [{ internalType: 'string', name: '', type: 'string' }],
        stateMutability: 'view',
        type: 'function',
      },
      { inputs: [], name: 'sync', outputs: [], stateMutability: 'nonpayable', type: 'function' },
      {
        inputs: [],
        name: 'token0',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'token1',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'totalSupply',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'uint256', name: 'value', type: 'uint256' },
        ],
        name: 'transfer',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: 'from', type: 'address' },
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'uint256', name: 'value', type: 'uint256' },
        ],
        name: 'transferFrom',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ],
  },
  RP1: {
    ADDRESS: IS_PRODUCTION
      ? '0x1Ab7E7DEdA201E5Ea820F6C02C65Fce7ec6bEd32'
      : '0x0000000000000000000000000000000000000000',
    ABI: RocketPropellant,
  },
  BOT: {
    ADDRESS: IS_PRODUCTION
      ? '0x0026908A7eFA57eccbbbE4Ba68C48eb670311d01'
      : '0x0000000000000000000000000000000000000000',
    ABI: BOT,
  },
  BOT_OLD: {
    ADDRESS: IS_PRODUCTION
      ? '0x1Ab7E7DEdA201E5Ea820F6C02C65Fce7ec6bEd32'
      : '0x0000000000000000000000000000000000000000',
    ABI: BOT,
  },
  REFINERY_VAULT: {
    ADDRESS: IS_PRODUCTION
      ? '0xa80240Eb5d7E05d3F250cF000eEc0891d00b51CC'
      : '0x0000000000000000000000000000000000000000',
    ABI: RefineryVault,
  },
  MULTICALL: {
    ADDRESS: IS_PRODUCTION
      ? '0xfF6FD90A470Aaa0c1B8A54681746b07AcdFedc9B'
      : '0x0000000000000000000000000000000000000000',
    ABI: Multicall,
  },
  SMART_REFINER_INITIALIZABLE: {
    ABI: SmartRefinerInitializable,
  },
  MASTER_BOTDEX: {
    ADDRESS: IS_PRODUCTION
      // MasterBotdex: 0xA8f44c840d98aA6B11C89028437a1De362fbd2E5
      // MasterChef (V1): 0x73feaa1eE314F8c655E354234017bE2193C9E24E
      // MasterChef (V2): 0xa5f8C5Dbd5F286960b9d90548680aE5ebFf07652
      ? '0xA8f44c840d98aA6B11C89028437a1De362fbd2E5'
      : '0x0000000000000000000000000000000000000000',
    ABI: MasterBotdex,
  },
  BOTDEX_OLD_STAKING: {
    ADDRESS: IS_PRODUCTION
      ? '0xf23360F93f5A007654EF4E4E04F3A586C7eD8E3f'
      : '0x0000000000000000000000000000000000000000',
    ABI: BotdexStaking,
  },
  BOTDEX_STAKING: {
    ADDRESS: IS_PRODUCTION
      ? '0x81df9127A67276B17fa9368062E373194D492E7A'
      : '0x0000000000000000000000000000000000000000',
    ABI: BotdexStaking,
  },
};
