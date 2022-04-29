import { useEffect } from 'react';

export const useSmoothTopScroll = (pathname = ''): void => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [pathname]);
};
