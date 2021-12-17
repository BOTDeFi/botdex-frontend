import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const useIntersectionObserver = <T extends Element>(): {
  observerRef: React.RefObject<T>;
  isIntersecting: boolean;
} => {
  const observerRef = useRef<T>(null);
  const [observerIsSet, setObserverIsSet] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);

  const checkObserverIsIntersecting = useCallback(([entry]: IntersectionObserverEntry[]) => {
    setIsIntersecting(entry.isIntersecting);
  }, []);

  const intersectionObserver = useMemo(() => {
    return new IntersectionObserver(checkObserverIsIntersecting, {
      rootMargin: '0px',
      threshold: 1,
    });
  }, [checkObserverIsIntersecting]);

  useEffect(() => {
    const ref = observerRef.current;
    if (!observerIsSet && ref) {
      // console.log('observerRef.current', ref);
      intersectionObserver.observe(ref);
      setObserverIsSet(true);
    }

    if (observerIsSet) {
      return () => intersectionObserver.disconnect();
    }

    return undefined;
  }, [observerIsSet, intersectionObserver]);

  return { observerRef, isIntersecting };
};

export default useIntersectionObserver;
