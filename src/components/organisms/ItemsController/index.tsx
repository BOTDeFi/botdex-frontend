import React from 'react';
import { RadioChangeEvent } from 'antd/lib/radio';
import { SwitchClickEventHandler } from 'antd/lib/switch';
import cn from 'classnames';

import { RadioGroup, Search, SortSelect, Switch } from '@/components/atoms';
import { debounce } from '@/utils/debounce';

import './ItemsController.scss';

interface IItemsController {
  prefixContainer?: React.ReactFragment;
  radioGroupOptions?: Array<{ text: string; value: string }>;
  radioGroupClassName?: string;
  sortOptions?: string[];
  searchPlaceholder?: string;
  searchDelay?: number;
  onSearchChange?: (value: string | number) => void;
  onStakedSwitchChange?: SwitchClickEventHandler;
  onRadioGroupChange?: (e: RadioChangeEvent) => void;
  onSortSelectChange?: (value: any, option: any) => void;
  hideSortAndSearch?: boolean;
}

const ItemsController: React.FC<IItemsController> = React.memo(
  ({
    prefixContainer,
    radioGroupOptions = [
      {
        text: 'Live',
        value: 'live',
      },
      {
        text: 'Finished',
        value: 'finished',
      },
      // {
      //   text: 'Discontinued',
      //   value: 'discontinued',
      // },
    ],
    radioGroupClassName,
    sortOptions,
    searchPlaceholder,
    searchDelay,
    onSearchChange,
    onStakedSwitchChange,
    onRadioGroupChange,
    onSortSelectChange,
    hideSortAndSearch = false,
  }) => {
    let handleSearch: typeof onSearchChange | undefined;
    if (onSearchChange) {
      handleSearch = searchDelay ? debounce(onSearchChange, searchDelay, false) : onSearchChange;
    }

    return (
      <div className="i-contr box-f-ai-c box-f-jc-sb t-box-b">
        <div className="box-f-ai-c t-box-b">
          {prefixContainer && prefixContainer}
          <Switch
            colorScheme="white"
            switchSize="sm"
            text={<span className="i-contr__switch-text text-bold">Staked only</span>}
            onChange={onStakedSwitchChange}
          />
          <RadioGroup
            className={cn('i-contr__radio', radioGroupClassName)}
            buttonClassName="i-contr__button"
            buttonStyle="solid"
            defaultValue="live"
            items={radioGroupOptions}
            onChange={onRadioGroupChange}
          />
        </div>
        {!hideSortAndSearch && (
          <div className="box-f-ai-c">
            <SortSelect
              className="i-contr__sort"
              label="Sort by"
              sortOptions={sortOptions}
              onChange={onSortSelectChange}
            />
            <Search
              className="i-contr__search"
              colorScheme="gray"
              placeholder={searchPlaceholder}
              realtime
              onChange={handleSearch}
            />
          </div>
        )}
      </div>
    );
  },
);

export default ItemsController;
