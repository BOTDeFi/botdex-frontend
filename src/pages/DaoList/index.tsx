import React, { useEffect, useState } from 'react';

import { Skeleton } from '@/components/atoms';
import { DaoPreview, DaoWrapper } from '@/components/sections/Dao';
import { DaoListItemsList } from '@/components/sections/DaoList';
import { SNAPSHOT_SPACE } from '@/config/constants/dao';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';
import {
  groupProposalsPreviewByStatus,
  IProposalsPreview,
  sortByCreated,
  transformGetProposalsPreview,
  useGetProposalsPreview,
} from '@/services/api/snapshot.org/hooks';

import './DaoList.scss';

const ITEMS_PER_PAGE = 20;

const LoaderSkeleton = new Array(3).fill('').map((_, index) => {
  return (
    <Skeleton.Input
      key={String(index)}
      className="dao-list__list-skeleton-loader"
      style={{ height: 60 }}
      active
      size="large"
    />
  );
});

const DaoList: React.FC = () => {
  const [loadData, setLoadData] = useState(false);
  const {
    getProposalsPreview,
    options: [, { loading, data }],
  } = useGetProposalsPreview({
    fetchPolicy: 'network-only',
  });
  const { observerRef, isIntersecting } = useIntersectionObserver<HTMLDivElement>();
  const [listItems, setNewItems] = useState<IProposalsPreview>([]);

  useEffect(() => {
    if (isIntersecting) {
      setLoadData(true);
    }
  }, [isIntersecting]);

  useEffect(() => {
    if (loadData) {
      getProposalsPreview(ITEMS_PER_PAGE + listItems.length, listItems.length, SNAPSHOT_SPACE);
      setLoadData(false);
    }
  }, [loadData, listItems.length, getProposalsPreview]);

  useEffect(() => {
    if (data) {
      setNewItems((prevState) => {
        // extract proposals from raw response
        const extractedListItems = transformGetProposalsPreview(data);
        // split proposals into separate groups by 'status': 'active', 'closed', 'pending'
        const { map: statesMap } = groupProposalsPreviewByStatus(extractedListItems);
        const { active = [], pending = [], closed = [] } = statesMap;
        active.sort(sortByCreated);
        pending.sort(sortByCreated);
        closed.sort(sortByCreated);

        return [...prevState, ...pending, ...active, ...closed];
      });
    }
  }, [data]);

  const isFirstLoading = listItems.length === 0;
  const Loader = isFirstLoading ? (
    LoaderSkeleton
  ) : (
    <div style={{ marginTop: 12 }}>{LoaderSkeleton}</div>
  );

  return (
    <DaoWrapper>
      <DaoPreview />
      <div className="dao-list__list-wrapper">
        <DaoListItemsList items={listItems} />
        <div ref={observerRef} />
        {loading && Loader}
      </div>
    </DaoWrapper>
  );
};
export default DaoList;
