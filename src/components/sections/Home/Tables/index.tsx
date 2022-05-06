/* eslint-disable */
import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { v1 as uuid } from 'uuid';

import { SliderArrow } from '@/assets/img/sections';
import { Button, ShadowTitle } from '@/components/atoms';
import { useMst } from '@/store';
import { handleScrollTop } from '@/utils/scrollTop';

import { stakingItems } from '../Home.mock';
import TableCard from '../Preview/TableCard';

import './Tables.scss';

const Tables: FC = observer(() => {
  const { farms } = useMst();

  return (
    <div className="preview-tables">
      <div className="preview-tables_body">
        <div className="preview-tables_body_content">
          <div className="preview-tables_body_content_earn">
            <div className="preview-tables_body_content_title">
              <ShadowTitle type="h2">Earn bot + Fees in Farms</ShadowTitle>
              <Button
                onClick={handleScrollTop}
                link="/farms"
                colorScheme="icon"
                icon={SliderArrow}
              />
            </div>

            <div className="preview-tables_body_content_earn-table">
              {farms.data.length &&
                farms.data.map(({ token, quoteToken }, index) => {
                  if (index > 1) {
                    return (
                      <TableCard
                        key={uuid()}
                        id={index}
                        token0={{ symbol: token.symbol, img: token.logoURI }}
                        token1={{ symbol: quoteToken.symbol, img: quoteToken.logoURI }}
                        apy="25"
                        className="preview-tables_body_content_earn-table_item"
                      />
                    );
                  }
                  return '';
                })}
            </div>

          </div>
          <div className="preview-tables_body_content_staking">
            <div className="preview-tables_body_content_title">
              <ShadowTitle type="h2">Staking</ShadowTitle>
              <Button
                link="/staking"
                colorScheme="icon"
                icon={SliderArrow}
                onClick={handleScrollTop}
                linkClassName="btn-staking"
              />
            </div>

            <div className="preview-tables_body_content_staking-table">
              {stakingItems.map(({ content, apy }, index) => {
                return (
                  <TableCard
                    key={uuid()}
                    id={index}
                    content={content}
                    apy={apy}
                    className="preview-tables_body_content_staking-table_item"
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Tables;
