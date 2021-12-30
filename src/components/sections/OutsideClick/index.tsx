import React, { useRef } from 'react';

import useOutsideClick from '../../../hooks/useOutsideClick';

interface IOutsideAlerterProps {
  onClick: () => void;
  className?: string;
}
const OutsideClick: React.FC<IOutsideAlerterProps> = ({ children, onClick, className }) => {
  const wrapperRef = useRef(null);
  useOutsideClick({ ref: wrapperRef, fn: onClick });

  return (
    <div ref={wrapperRef} className={className}>
      {children}
    </div>
  );
};

export default OutsideClick;
