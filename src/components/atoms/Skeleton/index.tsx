// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, { ReactComponentElement } from 'react';
import { Skeleton, SkeletonProps } from 'antd';

import 'antd/lib/skeleton/style/css';

export default Skeleton;

export const SkeletonTwoRows = (props: SkeletonProps): ReactComponentElement<any> => (
  <Skeleton active title={false} paragraph={{ rows: 2 }} {...props} />
);
export const SkeletonSixRows = (props: SkeletonProps): ReactComponentElement<any> => (
  <Skeleton active title={false} paragraph={{ rows: 6 }} {...props} />
);
export const SkeletonTenRows = (props: SkeletonProps): ReactComponentElement<any> => (
  <Skeleton active title={false} paragraph={{ rows: 10 }} {...props} />
);
