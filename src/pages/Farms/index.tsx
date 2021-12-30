import React, { useCallback, useMemo, useState } from 'react';
import { RadioChangeEvent } from 'antd/lib/radio';
import { SwitchClickEventHandler } from 'antd/lib/switch';
import BigNumber from 'bignumber.js/bignumber';
import { observer } from 'mobx-react-lite';

import { ItemsController } from '@/components/organisms';
import FarmsStakeUnstakeModal from '@/components/organisms/FarmsStakeUnstakeModal';
import { FarmsPreview, FarmsTable } from '@/components/sections/Farms';
import { useRefineryUsdPrice } from '@/hooks/useTokenUsdPrice';
import { getAddress } from '@/services/web3/contractHelpers';
import { useFarms, usePollFarmsData } from '@/store/farms/hooks';
import { Farm, FarmWithStakedValue } from '@/types';
import { toBigNumber } from '@/utils';
import { getFarmApr } from '@/utils/apr';

import './Farms.scss';

interface IFarmsContent {
  content: Farm[];
}

enum FilterBy {
  search = 'search',
  stakedOnly = 'stakedOnly',
  farmsType = 'farmsType',
}
type IFilterBy = keyof typeof FilterBy;
type IFilterFunc = (farm: Farm) => boolean | typeof Array.prototype.filter;

enum FarmsType {
  live = 'live',
  finished = 'finished',
}
type IFarmsType = keyof typeof FarmsType;

enum SortOptions {
  hot = 'Hot',
  apr = 'APR',
  multiplier = 'Multiplier',
  earned = 'Earned',
  liquidity = 'Liquidity',
}

const FarmsContent: React.FC<IFarmsContent> = ({ content }) => {
  return (
    <div className="farms__content">
      <FarmsTable data={content} />
    </div>
  );
};

const Farms: React.FC = observer(() => {
  // const { farms: farmsStore } = useMst();
  const { tokenUsdPrice: refineryPrice } = useRefineryUsdPrice();
  const { farms: rawFarms } = useFarms();
  const [, ...farmsWithoutFirstLpFarm] = rawFarms;
  usePollFarmsData();
  const [isActive, setIsActive] = useState<IFarmsType>(FarmsType.live);
  const [sortOption, setSortOption] = useState(SortOptions.hot);

  const farmsWithoutFirstLpFarmWithStakedValue = useMemo((): FarmWithStakedValue[] => {
    const farmsToDisplayWithAPR: FarmWithStakedValue[] = farmsWithoutFirstLpFarm.map((farm) => {
      if (!farm.lpTotalInQuoteToken || !farm.quoteToken.busdPrice) {
        return farm;
      }
      const totalLiquidity = new BigNumber(farm.lpTotalInQuoteToken).times(
        farm.quoteToken.busdPrice,
      );
      const { refineryRewardsApr, lpRewardsApr } = isActive
        ? getFarmApr(
            new BigNumber(String(farm.poolWeight)),
            new BigNumber(refineryPrice),
            totalLiquidity,
            // farm.lpAddresses[ChainId.MAINNET],
          )
        : { refineryRewardsApr: 0, lpRewardsApr: 0 };

      return { ...farm, apr: refineryRewardsApr, lpRewardsApr, liquidity: totalLiquidity };
    });

    return farmsToDisplayWithAPR;
  }, [farmsWithoutFirstLpFarm, isActive, refineryPrice]);

  // console.log(farmsWithoutFirstLpFarmWithStakedValue);

  const filterByStakedOnly = (value: BigNumber, isStaked: boolean) => {
    if (!isStaked) return true; // show all
    return !Number.isNaN(value.toNumber()) && value.gt(0);
  };
  const filterBySearch = (whereToFind: string[], toBeFound: string) => {
    return whereToFind.some((value) => {
      return value.toUpperCase().startsWith(toBeFound.toUpperCase());
    });
  };

  const getFilterByFarmsType = (isOpenedLiveTab: boolean): [IFilterBy, IFilterFunc] => {
    return [
      FilterBy.farmsType,
      ({ multiplier }) => {
        return isOpenedLiveTab && multiplier !== '0X'; // multiplier is set to 0X when farm is finished
      },
    ];
  };
  const getFilterByStakedOnly = useCallback((isStaked: boolean): [IFilterBy, IFilterFunc] => {
    return [
      FilterBy.stakedOnly,
      ({ userData }) => filterByStakedOnly(toBigNumber(userData?.stakedBalance), isStaked),
    ];
  }, []);

  const getFilterBySearch = (value: string): [IFilterBy, IFilterFunc] => {
    return [
      FilterBy.search,
      ({ lpSymbol, lpAddresses, quoteToken, token }) => {
        if (value.startsWith('0x')) {
          const searchSource = [lpAddresses, quoteToken.address, token.address].map((rawAddress) =>
            getAddress(rawAddress),
          );
          return filterBySearch(searchSource, value);
        }

        // normalize 'RP1', 'RP1-AVOOG LP' into same array presentation: ['RP1'] or ['RP1', 'AVOOG']
        const [removedLPSymbols] = lpSymbol.split(' ');
        const searchSource = removedLPSymbols.split('-');
        return filterBySearch(searchSource, value);
      },
    ];
  };

  const [appliedFilters, setAppliedFilters] = useState<Map<IFilterBy, IFilterFunc>>(
    /* SET DEFAULT FILTERS */
    new Map([getFilterByFarmsType(true), getFilterByStakedOnly(false)]),
  );

  const applyFilters = useCallback(
    (filters: [IFilterBy, IFilterFunc][]) => {
      setAppliedFilters(new Map([...appliedFilters, ...filters]));
    },
    [appliedFilters],
  );

  const filter = useCallback(() => {
    return [...appliedFilters.values()].reduce((acc, filterFunc) => {
      return acc.filter(filterFunc);
    }, farmsWithoutFirstLpFarmWithStakedValue);
  }, [appliedFilters, farmsWithoutFirstLpFarmWithStakedValue]);

  const sort = useCallback(
    (array: typeof farmsWithoutFirstLpFarmWithStakedValue) => {
      let sortFunc: (farm1: typeof array[0], farm2: typeof array[0]) => number;
      switch (sortOption) {
        case SortOptions.apr: {
          const getAprValue = (farm: FarmWithStakedValue) => {
            const apr = farm?.apr || 0;
            const lpRewardsApr = farm?.lpRewardsApr || 0;
            return apr + lpRewardsApr;
          };
          sortFunc = (farm1, farm2) => getAprValue(farm2) - getAprValue(farm1);
          break;
        }
        case SortOptions.multiplier: {
          const getMultiplier = (farm: FarmWithStakedValue) => {
            return farm.multiplier ? Number(farm.multiplier.slice(0, -1)) : 0;
          };
          sortFunc = (farm1, farm2) => getMultiplier(farm2) - getMultiplier(farm1);
          break;
        }
        case SortOptions.earned: {
          const getEarnedValue = (farm: FarmWithStakedValue) => {
            return farm.userData ? Number(farm.userData.earnings) : 0;
          };
          sortFunc = (farm1, farm2) => getEarnedValue(farm2) - getEarnedValue(farm1);
          break;
        }
        case SortOptions.liquidity: {
          const getLiquidity = (farm: FarmWithStakedValue) => {
            return Number(farm.liquidity);
          };
          sortFunc = (farm1, farm2) => getLiquidity(farm2) - getLiquidity(farm1);
          break;
        }
        case SortOptions.hot:
        default: {
          sortFunc = () => 0;
          break;
        }
      }
      return [...array].sort(sortFunc);
    },
    [sortOption],
  );

  const filteredFarms = useMemo(() => {
    return sort(filter());
  }, [sort, filter]);

  const handleStakedSwitchChange: SwitchClickEventHandler = (isStaked) => {
    applyFilters([getFilterByStakedOnly(isStaked)]);
  };

  const handleSearch = (value: string | number) => {
    applyFilters([getFilterBySearch(String(value))]);
  };

  const handleRadioGroupChange = (e: RadioChangeEvent) => {
    // setPoolsTypeFilter(e.target.value);
    const selectedTab: IFarmsType = e.target.value;
    setIsActive(selectedTab);
    const isOpenedLiveTab = FarmsType.live === selectedTab;

    applyFilters([getFilterByFarmsType(isOpenedLiveTab)]);
  };

  const handleSortSelectChange = (selected: any) => {
    const { value } = selected;
    setSortOption(value as SortOptions);
  };

  return (
    <main className="farms">
      <div className="row">
        <FarmsPreview />
        <ItemsController
          radioGroupOptions={[
            {
              text: 'Live',
              value: FarmsType.live,
            },
            {
              text: 'Finished',
              value: FarmsType.finished,
            },
          ]}
          radioGroupClassName="farms__i-contr"
          searchPlaceholder="Search Farms"
          searchDelay={300}
          onSearchChange={handleSearch}
          onStakedSwitchChange={handleStakedSwitchChange}
          onRadioGroupChange={handleRadioGroupChange}
          onSortSelectChange={handleSortSelectChange}
        />
        <FarmsContent content={filteredFarms} />
      </div>
      <FarmsStakeUnstakeModal />
    </main>
  );
});

export default Farms;
