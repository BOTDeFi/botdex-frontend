import React from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import { IProposalsPreview } from '@/services/api/snapshot.org/hooks';

import './List.scss';

interface IListProps {
  items: IProposalsPreview;
}

const List: React.FC<IListProps> = ({ items }) => {
  return (
    <ul className="list">
      {items.map((x) => {
        const { id, title, status } = x;
        return (
          <li key={JSON.stringify(x)} className="list__item">
            <Link to={`/dao/${id}`}>
              <div className="list__item-inner-wrapper">
                <div className="list__item-content text-smd text-black">{title}</div>
                <div
                  className={classNames(
                    'list__item-status',
                    `list__item-status_${status}`,
                    'btn',
                    'btn-ssm',
                    'text-ssmd',
                  )}
                >
                  {status}
                </div>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default List;
