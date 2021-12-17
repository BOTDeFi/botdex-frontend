import React, { useContext, useEffect, useRef, useState } from 'react';

const FAST_INTERVAL = 15000;
const SLOW_INTERVAL = 60000;

export const RefreshContext = React.createContext({ slow: 0, fast: 0 });

// Check if the tab is active in the user browser
const useIsBrowserTabActive = () => {
  const isBrowserTabActiveRef = useRef(true);

  useEffect(() => {
    const onVisibilityChange = () => {
      isBrowserTabActiveRef.current = !document.hidden;
    };

    window.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      window.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  return isBrowserTabActiveRef;
};

// This context maintain 2 counters that can be used as a dependencies on other hooks to force a periodic refresh
export const RefreshContextProvider: React.FC = ({ children }) => {
  const [slow, setSlow] = useState(0);
  const [fast, setFast] = useState(0);
  const isBrowserTabActiveRef = useIsBrowserTabActive();

  useEffect(() => {
    const interval = setInterval(async () => {
      if (isBrowserTabActiveRef.current) {
        setFast((prev) => prev + 1);
      }
    }, FAST_INTERVAL);
    return () => clearInterval(interval);
  }, [isBrowserTabActiveRef]);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (isBrowserTabActiveRef.current) {
        setSlow((prev) => prev + 1);
      }
    }, SLOW_INTERVAL);
    return () => clearInterval(interval);
  }, [isBrowserTabActiveRef]);

  return <RefreshContext.Provider value={{ slow, fast }}>{children}</RefreshContext.Provider>;
};

// This hook is used to perform components/fetches to update the displayed data
const useRefresh = () => {
  const { fast, slow } = useContext(RefreshContext);
  return { fastRefresh: fast, slowRefresh: slow };
};

export default useRefresh;
