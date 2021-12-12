import BigNumber from 'bignumber.js/bignumber';
import { autorun } from 'mobx';
import { getParent, Instance, types } from 'mobx-state-tree';

import { Precisions } from '@/types';
import { getInterestBreakdown, getPrincipalForInterest, getRoi } from '@/utils/compoundApy';
import { getBalanceAmount } from '@/utils/formatters';

import RoiOptionsModel from './RoiOptions';

// Used to track/react which currency user is editing (i.e. USD amount or Token amount)
export enum EditingCurrency {
  TOKEN,
  USD,
}

// Calculator works in 2 modes
export enum CalculatorMode {
  ROI_BASED_ON_PRINCIPAL, // User edits principal value and sees what ROI they get
  PRINCIPAL_BASED_ON_ROI, // User edits ROI value and sees what principal they need to invest to reach it
}

export const DEFAULT_PRINCIPAL_AS_TOKEN = '0.00';
export const DEFAULT_PRINCIPAL_AS_USD = '0.00';

// Mapping from the compounding frequency button index to actual componding frequency
// in number of compounds per day
const compoundingIndexToFrequency: Record<string, number> = {
  0: 1,
  1: 0.142857142,
  2: 0.071428571, // once every 7 days
  3: 0.033333333, // once every 30 days
};

export const initialState = {
  controls: {
    compounding: true,
    compoundingFrequency: 1, // how many compoound in a day , e.g. 1 = once a day, 0.071 - once per 2 weeks
    activeCompoundingIndex: 0, // active compounding selected in
    stakingDuration: 3, // value as index associated with stakedOptions
    mode: CalculatorMode.ROI_BASED_ON_PRINCIPAL,
    editingCurrency: EditingCurrency.USD,
  },
  data: {
    principalAsToken: DEFAULT_PRINCIPAL_AS_TOKEN,
    principalAsUSD: DEFAULT_PRINCIPAL_AS_USD,
    roiUSD: 0,
    roiTokens: 0,
    roiPercentage: 0,
  },
};

const RoiStateModel = types
  .model({
    controls: types.model({
      compounding: types.boolean,
      compoundingFrequency: types.number, // how many compoound in a day , e.g. 1 = once a day, 0.071 - once per 2 weeks
      activeCompoundingIndex: types.number, // active compounding selected in
      stakingDuration: types.number,
      mode: types.number,
      editingCurrency: types.number,
    }),
    data: types.model({
      principalAsToken: types.string,
      principalAsUSD: types.string,
      roiUSD: types.number,
      roiTokens: types.number,
      roiPercentage: types.number,
    }),
  })
  .actions((self) => {
    const parent = getParent(self) as Instance<typeof RoiModal>;

    const toggleCompounding = () => {
      self.controls.compounding = !self.controls.compounding;
    };

    const toggleEditingCurrency = () => {
      self.controls.editingCurrency =
        self.controls.editingCurrency === EditingCurrency.TOKEN
          ? EditingCurrency.USD
          : EditingCurrency.TOKEN;
    };

    const setCalculatorMode = (mode: CalculatorMode) => {
      self.controls.mode = mode;
      if (mode === CalculatorMode.PRINCIPAL_BASED_ON_ROI) {
        self.data.roiUSD = parseFloat(self.data.roiUSD.toFixed(Precisions.fiat));
      }
    };

    const setCompoundingFrequency = ({
      index,
      autoCompoundFrequency,
    }: {
      index?: number;
      autoCompoundFrequency?: number;
    }) => {
      if (autoCompoundFrequency) {
        self.controls.compoundingFrequency = autoCompoundFrequency;
      } else {
        if (index === undefined) return;
        const compoundingFrequency = compoundingIndexToFrequency[index];
        self.controls.activeCompoundingIndex = index;
        self.controls.compoundingFrequency = compoundingFrequency;
      }
    };

    const setStakingDuration = (stakingDuration: number) => {
      self.controls.stakingDuration = stakingDuration;
    };

    const setPrincipal = (asUsd: string, asToken: string) => {
      self.data.principalAsToken = asToken;
      self.data.principalAsUSD = asUsd;
      self.controls.mode = CalculatorMode.ROI_BASED_ON_PRINCIPAL;
    };

    // Handler for principal input when in USD mode
    const setPrincipalFromUSDValue = (principalAmountAsText: string | number) => {
      if (!parent.options) return;
      const { stakingTokenPrice, stakingTokenBalance } = parent.options;
      const principalAmount = Number(principalAmountAsText);

      let amount: number;
      if (Number.isNaN(principalAmount)) {
        amount = getBalanceAmount(new BigNumber(stakingTokenBalance).times(stakingTokenPrice));
      } else {
        amount = principalAmount;
      }

      const principalAsTokenBN = new BigNumber(amount).div(stakingTokenPrice);
      const principalAsToken = principalAsTokenBN.gt(0)
        ? principalAsTokenBN.toFixed(Precisions.token)
        : DEFAULT_PRINCIPAL_AS_TOKEN;

      setPrincipal(String(amount), principalAsToken);
    };

    // Handler for principal input when in Token mode
    const setPrincipalFromTokenValue = (amount: string | number) => {
      if (!parent.options) return;
      const { stakingTokenPrice } = parent.options;
      const principalAsUsdBN = new BigNumber(amount).times(stakingTokenPrice);
      const principalAsUsdString = principalAsUsdBN.gt(0)
        ? principalAsUsdBN.toFixed(Precisions.fiat)
        : DEFAULT_PRINCIPAL_AS_USD;

      setPrincipal(principalAsUsdString, String(amount));
    };

    // Handler for ROI input
    const setTargetRoi = (amount: string | number) => {
      if (!parent.options) return;
      const { earningTokenPrice } = parent.options;
      const targetRoiAsTokens = new BigNumber(amount).div(earningTokenPrice);

      self.data.roiUSD = Number(amount);
      self.data.roiTokens = targetRoiAsTokens.isNaN() ? 0 : targetRoiAsTokens.toNumber();
      self.controls.mode = CalculatorMode.PRINCIPAL_BASED_ON_ROI;
    };

    // Calculates and sets ROI whenever related values change
    const setRoi = (roiUSD: number, roiTokens: number, roiPercentage: number) => {
      self.data.roiUSD = roiUSD;
      self.data.roiTokens = roiTokens;
      self.data.roiPercentage = roiPercentage;
    };
    autorun(() => {
      if (!parent.options) return;
      if (self.controls.mode === CalculatorMode.ROI_BASED_ON_PRINCIPAL) {
        const { compounding, compoundingFrequency, stakingDuration } = self.controls;
        const { principalAsUSD } = self.data;
        const { apr, earningTokenPrice, performanceFee } = parent.options;
        const principalInUSDAsNumber = parseFloat(principalAsUSD);
        const compoundFrequency = compounding ? compoundingFrequency : 0;
        const interestBreakdown = getInterestBreakdown({
          principalInUSD: principalInUSDAsNumber,
          apr,
          earningTokenPrice,
          compoundFrequency,
          performanceFee,
        });
        const hasInterest = !Number.isNaN(interestBreakdown[stakingDuration]);
        const roiTokens = hasInterest ? interestBreakdown[stakingDuration] : 0;
        const roiAsUSD = hasInterest ? roiTokens * earningTokenPrice : 0;
        const roiPercentage = hasInterest
          ? getRoi({
              amountEarned: roiAsUSD,
              amountInvested: principalInUSDAsNumber,
            })
          : 0;
        setRoi(roiAsUSD, roiTokens, roiPercentage);
      }
    });

    // Calculates and sets principal based on expected ROI value
    const setPrincipalForTargetRoi = (
      principalAsUSD: string,
      principalAsToken: string,
      roiPercentage: number,
    ) => {
      self.data.principalAsUSD = principalAsUSD;
      self.data.principalAsToken = principalAsToken;
      self.data.roiPercentage = roiPercentage;
    };
    autorun(() => {
      if (!parent.options) return;
      if (self.controls.mode === CalculatorMode.PRINCIPAL_BASED_ON_ROI) {
        const { compounding, compoundingFrequency, stakingDuration } = self.controls;
        const { roiUSD } = self.data;
        const { apr, performanceFee, stakingTokenPrice } = parent.options;

        const principalForExpectedRoi = getPrincipalForInterest(
          roiUSD,
          apr,
          compounding ? compoundingFrequency : 0,
          performanceFee,
        );
        const principalUSD = !Number.isNaN(principalForExpectedRoi[stakingDuration])
          ? principalForExpectedRoi[stakingDuration]
          : 0;
        const principalToken = new BigNumber(principalUSD).div(stakingTokenPrice);
        const roiPercentage = getRoi({
          amountEarned: roiUSD,
          amountInvested: principalUSD,
        });

        setPrincipalForTargetRoi(
          principalUSD.toFixed(Precisions.fiat),
          principalToken.toFixed(Precisions.token),
          roiPercentage,
        );
      }
    });

    return {
      toggleCompounding,
      toggleEditingCurrency,
      setCalculatorMode,
      setCompoundingFrequency,
      setStakingDuration,
      setPrincipalFromUSDValue,
      setPrincipalFromTokenValue,
      setPrincipal,
      setTargetRoi,
    };
  });

const RoiModal = types
  .model({
    options: types.maybeNull(RoiOptionsModel),
    state: RoiStateModel,
  })
  .views((self) => ({
    get isOpen() {
      return Boolean(self.options);
    },
  }))
  .actions((self) => ({
    close() {
      self.options = null;
      self.state = initialState as Instance<typeof RoiStateModel>;
    },
    open(options: Instance<typeof RoiOptionsModel>) {
      self.options = options;
      // If pool is auto-compounding set state's compounding frequency to this pool's auto-compound frequency
      if (options.autoCompoundFrequency > 0) {
        self.state.setCompoundingFrequency({
          autoCompoundFrequency: options.autoCompoundFrequency,
        });
      }
    },
  }));

export default RoiModal;
