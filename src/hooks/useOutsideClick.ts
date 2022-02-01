import { RefObject, useCallback, useEffect } from 'react';

interface UseOutsideClickParams {
  ref: RefObject<HTMLInputElement>;
  fn: () => void;
}

const useOutsideClick = ({ ref, fn }: UseOutsideClickParams): any => {
  const handleClickOutside = useCallback(
    (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        fn();
      }
    },
    [fn, ref],
  );
  useEffect(() => {
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, fn, handleClickOutside]);
};

export default useOutsideClick;
