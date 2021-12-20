// import { Token } from '@/types';
import { types } from 'mobx-state-tree';

// export interface ITokenMobx extends Token {
//   decimals: number;
//   projectLink: string;
//   logoURI: string;
//   busdPrice: string;
// }

const FarmsStakeUnstakeModal = types
  .model({
    isOpen: types.optional(types.boolean, false),
    isStaking: types.boolean,
    maxValue: types.string,
    tokenSymbol: types.string,
    lpPrice: types.string,
    farmId: types.number,
    addLiquidityUrl: types.string,
  })
  .actions((self) => ({
    close() {
      self.isOpen = false;
    },
    open({
      isStaking,
      maxValue,
      tokenSymbol,
      farmId,
      lpPrice,
      addLiquidityUrl,
    }: {
      isStaking: boolean;
      maxValue: string;
      tokenSymbol: string;
      farmId: number;
      lpPrice: string;
      addLiquidityUrl: string;
    }) {
      self.isOpen = true;

      self.isStaking = isStaking;
      self.maxValue = maxValue;
      self.tokenSymbol = tokenSymbol;
      self.farmId = farmId;
      self.lpPrice = lpPrice;
      self.addLiquidityUrl = addLiquidityUrl;
    },
  }));

export default FarmsStakeUnstakeModal;
