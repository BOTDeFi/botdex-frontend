import { makeAutoObservable, runInAction } from "mobx"
import { priceBotApi } from "../api"

class PriceBotData {

  currentPrice = 0;

  currencyShift = 0;

  currencyShiftPercent = 0;

  currencyShiftReversed = 0;

  currencyShiftPercentReversed = 0;

  priceByMin = [
    {
      priceBOTBUSD: 0.008945603350069317,
      priceBUSDBOT: 111.2266971869464,
      dateTimeUTC: "2022-05-21T06:20:00",
      timestampUTC: 1653114000
    },
    {
      priceBOTBUSD: 0.008945603350069317,
      priceBUSDBOT: 111.2266971869464,
      dateTimeUTC: "2022-05-21T06:21:00",
      timestampUTC: 1653114060
    }
  ]

  constructor() {
    makeAutoObservable(this)
  }

  async setPriceData(option: string) {
    const res = await priceBotApi.getPriceByOption(option)
    switch (option) {
      case 'minuts':
        runInAction(() => {
          this.priceByMin = [...res.priceByMinuts]
        })
        break;
      case 'hours':
        runInAction(() => {
          this.priceByMin = [...res.priceByHours]
        })
        break;
      case 'days':
        runInAction(() => {
          this.priceByMin = [...res.priceByDays]
        })
        break;
      case 'months':
        runInAction(() => {
          this.priceByMin = [...res.priceByMonths]
        })
        break;
      default:
        runInAction(() => {
          this.priceByMin = [...res.priceByHours]
        })
        break;
    }
  }

  async setCurrentPrice() {
    const res = await priceBotApi.getCurrentBotPrice()

    runInAction(() => {
      this.currentPrice = res
    })
  }

  async setCurrencyShift() {
    const current = await priceBotApi.getCurrentBotPrice()
    const old = await priceBotApi.getPriceByOption('days')

    runInAction(() => {
      this.currencyShift = current - old.priceByDays[0].priceBOTBUSD
      this.currencyShiftPercent = current / old.priceByDays[0].priceBOTBUSD

      // Reverse data
      this.currencyShiftReversed = old.priceByDays[0].priceBOTBUSD - current
      this.currencyShiftPercentReversed = 1 / current / old.priceByDays[0].priceBUSDBOT
    })
  }

  getPriceByMin() {
    return [this.priceByMin.map(item => [item.timestampUTC, item.priceBOTBUSD])]
  }

  getCurrentPrice() {
    return this.currentPrice
  }

  getCurrencyShift() {
    return this.currencyShift
  }

  getCurrencyShiftPercent() {
    return this.currencyShiftPercent
  }

  getCurrencyShiftReversed() {
    return this.currencyShiftReversed
  }

  getCurrencyShiftPercentReversed() {
    return this.currencyShiftPercentReversed
  }

}

export default new PriceBotData()