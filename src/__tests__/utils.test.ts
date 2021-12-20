import BigNumber from 'bignumber.js/bignumber';

import { toBigNumber } from '@/utils';

describe('Utils', () => {
  describe('toBigNumber should return', () => {
    const BIG_ZERO = new BigNumber(0);
    const BIG_NUMBER = new BigNumber(7);

    it('null if value = null & nullable = true', () => {
      expect(toBigNumber(null, true)).toBe(null);
      expect(toBigNumber(BIG_NUMBER, true)).toEqual(BIG_NUMBER);
    });

    it('BigNumber if value is not null & nullable = true', () => {
      expect(toBigNumber('0', true)).toEqual(BIG_ZERO);
      expect(toBigNumber(0, true)).toEqual(BIG_ZERO);
      expect(toBigNumber(BIG_ZERO, true)).toEqual(BIG_ZERO);
      expect(toBigNumber(undefined, true)).toEqual(BIG_ZERO);
    });

    it('BigNumber if nullable is omitted', () => {
      const value = 1421;
      expect(toBigNumber(String(value))).toEqual(new BigNumber(value));
      expect(toBigNumber(value)).toEqual(new BigNumber(value));
      expect(toBigNumber(BIG_NUMBER)).toEqual(BIG_NUMBER);
      expect(toBigNumber(undefined)).toEqual(BIG_ZERO);
    });
  });
});
