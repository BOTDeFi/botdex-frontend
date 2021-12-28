import { types } from 'mobx-state-tree';

const TokenModel = types.model({
  id: types.string,
  name: types.string,
  symbol: types.string,
  derivedUSD: types.string,
});

const PairModel = types.model({
  id: types.string,
  name: types.string,
  token0: TokenModel,
  token1: TokenModel,
});

const PointDataModel = types.model({
  id: types.string,
  timestamp: types.number,
  reserve0: types.string,
  reserve1: types.string,
});

const CurrentPairDataModel = types.model({
  points: types.optional(types.array(PointDataModel), []),
  id: types.string,
});

const countShift = (price?: number, openPrice?: number) => {
  if (price && openPrice) {
    return price - openPrice;
  }
  return 0;
};

const countPercentShift = (ratio?: number, price?: number) => {
  if (ratio && price) {
    return (ratio / price) * 100;
  }
  return 0;
};

const PairsModel = types
  .model({
    pair: PairModel,
    currentPairData: CurrentPairDataModel,
  })
  .actions((self) => ({
    setPair(pair: any) {
      self.pair = pair;
    },

    setCurrentPairData(id: string, points: any) {
      self.currentPairData = {
        points,
        id,
      };
    },

    getFormattedPoints(reversed = false) {
      return self.currentPairData.points.map((el) => {
        const currentTokenPrice =
          +el[reversed ? 'reserve1' : 'reserve0'] / +el[reversed ? 'reserve0' : 'reserve1'];
        return [el.timestamp * 1000, currentTokenPrice];
      });
    },

    getFormattedCurrentPair(id: number, reversed = false) {
      const currentPair = self.pair;

      const firstPoint = self.currentPairData.points[self.currentPairData.points.length - 1];
      const currentPoint = self.currentPairData.points[id];

      const token0 = currentPair[reversed ? 'token1' : 'token0'];

      const firstTokenPrice =
        +firstPoint[reversed ? 'reserve1' : 'reserve0'] /
        +firstPoint[reversed ? 'reserve0' : 'reserve1'];

      const currentTokenPrice =
        +currentPoint[reversed ? 'reserve1' : 'reserve0'] /
        +currentPoint[reversed ? 'reserve0' : 'reserve1'];

      return {
        icons: ['', ''],
        names: currentPair.name.split(' '),
        date: new Date(+currentPoint.timestamp * 1000).toDateString(),
        price: currentTokenPrice,
        currency: token0.name,
        shift: countShift(currentTokenPrice, firstTokenPrice),
        percentShift: countPercentShift(
          countShift(currentTokenPrice, firstTokenPrice),
          currentTokenPrice,
        ),
      };
    },
  }));

export default PairsModel;
