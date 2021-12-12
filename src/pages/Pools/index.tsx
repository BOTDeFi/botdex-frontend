import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { RadioChangeEvent } from 'antd/lib/radio';
import { SwitchClickEventHandler } from 'antd/lib/switch';
import BigNumber from 'bignumber.js/bignumber';
import cn from 'classnames';
import { observer } from 'mobx-react-lite';

import { ReactComponent as CardViewIcon } from '@/assets/img/icons/card-view.svg';
import { ReactComponent as ListViewIcon } from '@/assets/img/icons/list-view.svg';
import { Button } from '@/components/atoms';
import { CollectModal, ItemsController, StakeUnstakeModal } from '@/components/organisms';
import { PoolCard, PoolsPreview, PoolTable } from '@/components/sections/Pools';
import { getAprData } from '@/components/sections/Pools/PoolCard/utils';
import useRefresh from '@/hooks/useRefresh';
import { getAddress } from '@/services/web3/contractHelpers';
import { useMst } from '@/store';
import { getFarmMode, getRefineryVaultEarnings } from '@/store/pools/helpers';
import { usePools, useSelectVaultData } from '@/store/pools/hooks';
import { Pool, Token } from '@/types';
import { BIG_ZERO } from '@/utils/constants';
import { feeFormatter } from '@/utils/formatters';
import { clog } from '@/utils/logger';

import './Pools.scss';

enum PoolsContentView {
  list = 'list',
  card = 'card',
}
interface IPoolsContent {
  view: PoolsContentView;
  content: Pool[];
}

const ListCardViewButtons: React.FC<{
  view: PoolsContentView;
  onChange: (value: boolean) => void;
}> = ({ view, onChange }) => {
  const prefixContainer = [
    {
      key: 'list-view-mode',
      icon: ListViewIcon,
      handler: () => onChange(true),
      activeClassCondition: view === PoolsContentView.list,
      title: 'List View',
    },
    {
      key: 'card-view-mode',
      icon: CardViewIcon,
      handler: () => onChange(false),
      activeClassCondition: view === PoolsContentView.card,
      title: 'Card View',
    },
  ];

  return (
    <div className="pools__i-contr-prefix box-f-ai-c">
      {prefixContainer.map((item) => {
        const { key, handler, activeClassCondition, title } = item;
        return (
          <Button
            key={key}
            className="pools__i-contr-button"
            title={title}
            colorScheme="white"
            size="ssm"
            onClick={handler}
          >
            <item.icon
              className={cn('pools__i-contr-icon', {
                'pools__i-contr-icon_active': activeClassCondition,
              })}
            />
          </Button>
        );
      })}
    </div>
  );
};

const PoolsContent: React.FC<IPoolsContent> = ({ view, content }) => {
  return (
    <div className="pools__content">
      <div className={`pools__content-${view}-view`}>
        {view === PoolsContentView.list && <PoolTable data={content} />}
        {view === PoolsContentView.card &&
          content.map((pool) => {
            const farmMode = getFarmMode(pool);
            return (
              <PoolCard
                key={pool.isAutoVault ? 'auto-pool' : pool.id}
                farmMode={farmMode}
                pool={pool}
              />
            );
          })}
      </div>
    </div>
  );
};

enum FilterBy {
  name = 'name',
  stakedOnly = 'stakedOnly',
  poolsType = 'poolsType',
}
type IFilterBy = keyof typeof FilterBy;
type IFilterFunc = (pool: Pool) => boolean | typeof Array.prototype.filter;

enum PoolsType {
  live = 'live',
  finished = 'finished',
}
type IPoolsType = keyof typeof PoolsType;

enum SortOptions {
  hot = 'Hot',
  apr = 'APR',
  earned = 'Earned',
  totalStaked = 'Total staked',
}

// type ISortOptions = keyof typeof SortOptions;

const Pools: React.FC = observer(() => {
  const { user, pools: poolsStore } = useMst();
  const { pools: poolsWithoutAutoVault } = usePools();
  const {
    totalRefineryInVault,
    pricePerFullShare,
    userData: { refineryAtLastUserAction, userShares },
    fees: { performanceFee },
  } = useSelectVaultData();
  // const [filteredPools, setFilteredPools] = useState(poolsWithoutAutoVault);
  const [appliedFilters, setAppliedFilters] = useState<Map<IFilterBy, IFilterFunc>>(new Map());
  const [isListView, setIsListView] = useState(
    localStorage['refinery-finance-pools-view'] === PoolsContentView.list,
  );
  // const [poolsTypeFilter, setPoolsTypeFilter] = useState(PoolsType.live);
  const [sortOption, setSortOption] = useState(SortOptions.hot);

  const filter = useCallback(() => {
    return [...appliedFilters.values()].reduce((acc, filterFunc) => {
      return acc.filter(filterFunc);
    }, poolsWithoutAutoVault);
  }, [appliedFilters, poolsWithoutAutoVault]);

  const sort = useCallback(
    (array: typeof poolsWithoutAutoVault) => {
      let sortFunc: (pool1: typeof array[0], pool2: typeof array[0]) => number;
      switch (sortOption) {
        case SortOptions.apr: {
          const performanceFeeAsDecimal = feeFormatter(Number(performanceFee));
          const getAprValue = (pool: Pool) => {
            // Ternary is needed to prevent pools without APR getting top spot
            return pool.apr ? getAprData(pool, performanceFeeAsDecimal).apr : 0;
          };
          sortFunc = (pool1, pool2) => getAprValue(pool2) - getAprValue(pool1);
          break;
        }
        case SortOptions.earned: {
          const getPoolEarnedValue = (pool: Pool) => {
            if (!pool.userData || !pool.earningTokenPrice) {
              return 0;
            }
            const tokenEarnings = pool.isAutoVault
              ? new BigNumber(
                  getRefineryVaultEarnings(
                    user.address,
                    refineryAtLastUserAction || BIG_ZERO,
                    userShares || BIG_ZERO,
                    pricePerFullShare || BIG_ZERO,
                  ).autoRefineryToDisplay,
                )
              : pool.userData.pendingReward;
            return tokenEarnings.times(pool.earningTokenPrice).toNumber();
          };
          sortFunc = (pool1, pool2) => getPoolEarnedValue(pool2) - getPoolEarnedValue(pool1);
          break;
        }
        case SortOptions.totalStaked: {
          const getPoolTotalStaked = (pool: Pool) => {
            return pool.isAutoVault
              ? totalRefineryInVault?.toNumber() || 0
              : pool.totalStaked?.toNumber() || 0;
          };
          sortFunc = (pool1, pool2) => getPoolTotalStaked(pool2) - getPoolTotalStaked(pool1);
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
    [
      sortOption,
      totalRefineryInVault,
      performanceFee,
      pricePerFullShare,
      refineryAtLastUserAction,
      user.address,
      userShares,
    ],
  );

  const filteredPools = useMemo(() => sort(filter()), [sort, filter]);

  const pools = useMemo(() => {
    const refinerPool = filteredPools.find((pool) => pool.id === 0);
    let refinerAutoVault: Pool;
    if (refinerPool) {
      refinerAutoVault = { ...refinerPool, isAutoVault: true };
      return [refinerAutoVault, ...filteredPools];
    }
    return filteredPools;
  }, [filteredPools]);

  const handleSwitchView = (value: boolean) => {
    localStorage['refinery-finance-pools-view'] = value
      ? PoolsContentView.list
      : PoolsContentView.card;
    setIsListView(value);
  };

  const filterByStakedOnly = (value: BigNumber, isStaked: boolean) => {
    if (!isStaked) return true; // show all
    return !Number.isNaN(value.toNumber()) && value.gt(0);
  };

  const filterByName = (whereToFind: string, toBeFound: string) => {
    return whereToFind.split(' ').some((value) => {
      return value.toUpperCase().startsWith(toBeFound.toUpperCase());
    });
  };

  const handleStakedSwitchChange: SwitchClickEventHandler = (isStaked) => {
    setAppliedFilters(
      new Map([
        ...appliedFilters,
        [
          FilterBy.stakedOnly,
          ({ userData }) =>
            filterByStakedOnly(
              userData?.stakedBalance ? userData.stakedBalance : BIG_ZERO,
              isStaked,
            ),
        ],
      ]),
    );
  };

  const searchByTokenAddress = (stakingToken: Token, earningToken: Token, value: string) => {
    return filterByName(
      `${getAddress(stakingToken.address)} ${getAddress(earningToken.address)}`,
      value,
    );
  };
  const searchByTokenSymbol = (stakingToken: Token, earningToken: Token, value: string) => {
    return filterByName(`${stakingToken.symbol} ${earningToken.symbol}`, value);
  };

  const handleSearch = (value: string | number) => {
    const validatedValue = String(value);
    setAppliedFilters(
      new Map([
        ...appliedFilters,
        [
          FilterBy.name,
          ({ stakingToken, earningToken }) => {
            if (validatedValue.startsWith('0x')) {
              return searchByTokenAddress(stakingToken, earningToken, validatedValue);
            }
            return searchByTokenSymbol(stakingToken, earningToken, validatedValue);
          },
        ],
      ]),
    );
  };

  const handleRadioGroupChange = (e: RadioChangeEvent) => {
    // setPoolsTypeFilter(e.target.value);
    const selectedTab: IPoolsType = e.target.value;
    const isOpenedLiveTab = PoolsType.live === selectedTab;

    setAppliedFilters(
      new Map([
        ...appliedFilters,
        [
          FilterBy.poolsType,
          ({ isFinished = false }) => {
            if (isOpenedLiveTab) return !isFinished;
            return isFinished;
          },
        ],
      ]),
    );
  };

  const handleSortSelectChange = (selected: any) => {
    const { value } = selected;
    setSortOption(value as SortOptions);
    clog(value);
  };

  useEffect(() => {
    // Live Pools filter
    const selectedTab: IPoolsType = PoolsType.live;
    const isOpenedLiveTab = PoolsType.live === selectedTab;
    // Is Staked Only filter
    const isStaked = false;
    setAppliedFilters(
      new Map([
        [
          FilterBy.poolsType,
          ({ isFinished = false }) => {
            if (isOpenedLiveTab) return !isFinished;
            return isFinished;
          },
        ],
        [
          FilterBy.stakedOnly,
          ({ userData }) =>
            filterByStakedOnly(
              userData?.stakedBalance ? userData.stakedBalance : BIG_ZERO,
              isStaked,
            ),
        ],
      ]),
    );
  }, []);

  const { slowRefresh, fastRefresh } = useRefresh();

  // <-- Fetch Vault Data -->
  useEffect(() => {
    poolsStore.fetchVaultPublicData();
  }, [poolsStore, fastRefresh]);

  useEffect(() => {
    if (user.address) {
      poolsStore.fetchVaultUserData(user.address);
    }
  }, [poolsStore, user.address, fastRefresh]);

  useEffect(() => {
    poolsStore.fetchVaultFees();
  }, [poolsStore]);

  // <-- Fetch Pools Data -->
  useEffect(() => {
    poolsStore.fetchPoolsPublicData();
  }, [poolsStore, slowRefresh]);

  return (
    <>
      <main className="pools">
        <div className="row">
          <PoolsPreview />
          <ItemsController
            prefixContainer={
              <ListCardViewButtons
                view={isListView ? PoolsContentView.list : PoolsContentView.card}
                onChange={handleSwitchView}
              />
            }
            radioGroupOptions={[
              {
                text: 'Live',
                value: PoolsType.live,
              },
              {
                text: 'Finished',
                value: PoolsType.finished,
              },
            ]}
            radioGroupClassName="pools__i-contr"
            sortOptions={['Hot', 'APR', 'Earned', 'Total staked']}
            searchPlaceholder="Search Pools"
            searchDelay={300}
            onSearchChange={handleSearch}
            onStakedSwitchChange={handleStakedSwitchChange}
            onRadioGroupChange={handleRadioGroupChange}
            onSortSelectChange={handleSortSelectChange}
          />
          <PoolsContent
            view={isListView ? PoolsContentView.list : PoolsContentView.card}
            content={pools}
          />
        </div>
      </main>
      <StakeUnstakeModal />
      <CollectModal />
    </>
  );
});

export default Pools;
