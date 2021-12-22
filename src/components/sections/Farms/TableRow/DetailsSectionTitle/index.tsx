import React from 'react';
import classNames from 'classnames';

const DetailsSectionTitle: React.FC<{
  className?: string;
  title: string | JSX.Element;
}> = ({ className, title }) => {
  return (
    <div
      className={classNames(
        className,
        'farms-table-row__details-title',
        'text-black text-ssm text-upper',
      )}
    >
      {title}
    </div>
  );
};

export default DetailsSectionTitle;
