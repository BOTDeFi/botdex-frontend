import React from 'react';
import classNames from 'classnames';

import './Information.scss';

interface IInformationProps {
  className?: string;
  title?: string | React.ReactNode;
  customClasses?: {
    title?: string;
    content?: string;
  };
}

const Information: React.FC<IInformationProps> = ({
  className,
  title,
  children,
  customClasses = {},
}) => {
  return (
    <section className={classNames('information', className)}>
      <div
        className={classNames(
          'information__title',
          'text-black text-bold text-smd',
          customClasses.title,
        )}
      >
        {title}
      </div>
      <div className={classNames('information__content', customClasses.content)}>{children}</div>
    </section>
  );
};

export default Information;
