import BigNumber from 'bignumber.js/bignumber';

import { getContract } from '@/services/web3/contractHelpers';
import { Stake } from '@/types';
import { BIG_TEN } from '@/utils/constants';
import { getBalanceAmountBN } from '@/utils/formatters';

export const getStakesLength = async (): Promise<number> => {
  const stakingContract = getContract('BOTDEX_STAKING');
  return stakingContract.methods.getPoolLength().call();
};

export const getStakesData = async (stakesLength: number): Promise<Stake[]> => {
  const stakingContract = getContract('BOTDEX_STAKING');
  const result = [];
  for (let i = 0; i < stakesLength; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const stakeData = await stakingContract.methods.pools(i).call();
    result.push({
      id: i,
      amountStaked: parseInt(stakeData.amountStaked, 10),
      timeLockUp: parseInt(stakeData.timeLockUp, 10),
      APY: parseInt(stakeData.APY, 10) / 10,
      isDead: stakeData.isDead,
    });
  }

  return result;
};

export const getUserData = async (id: number, accountAddress: string) => {
  const stakingContract = getContract('BOTDEX_STAKING');
  const userData = await stakingContract.methods.userAtPoolInfo(accountAddress, id).call();
  return {
    amount: parseInt(userData.amount, 10),
    start: parseInt(userData.start, 10),
  };
};

export const convertSeconds = (time: number): string => {
  let result = time / 60;
  if (result >= 60) {
    result = Math.ceil(result / 60);
    return `${result} hours`;
  }
  if (result >= 3600) {
    result = Math.ceil(result / 60 / 24);
    return `${result} days`;
  }
  if (result >= 2592000) {
    result = Math.ceil(result / 60 / 24 / 30);
    return `${result} month`;
  }
  return `${result} min`;
};

export const getUserBalance = async (address: string) => {
  const tokenContract = getContract('BOT');
  const balance = await tokenContract.methods.balanceOf(address).call();
  return getBalanceAmountBN(balance, 18);
};

export const enterStaking = async (id: number, amount: string, address: string) => {
  const stakingContract = getContract('BOTDEX_STAKING');
  await stakingContract.methods
    .enterStaking(id, new BigNumber(amount).times(BIG_TEN.pow(18)).toString())
    .send({ from: address });
};

export const updateStakeData = async (id: number, address: string) => {
  const stakingContract = getContract('BOTDEX_STAKING');
  const stakeData = await stakingContract.methods.pools(id).call();
  const userData = await stakingContract.methods.userAtPoolInfo(address, id).call();
  const reward = await calculateReward(id, address);
  return {
    amountStaked: parseInt(stakeData.amountStaked, 10),
    userData: {
      amount: parseInt(userData.amount, 10),
      start: parseInt(userData.start, 10),
    },
    reward,
  };
};

export const calculateReward = async (id: number, address: string) => {
  const tokenContract = getContract('BOTDEX_STAKING');
  const reward = await tokenContract.methods.calculateReward(id, address).call();
  // return getBalanceAmountBN(reward, 18);
  return reward;
};

export const collectReward = async (id: number, address: string) => {
  const stakingContract = getContract('BOTDEX_STAKING');
  await stakingContract.methods.withdrawReward(id).send({ from: address });
};
