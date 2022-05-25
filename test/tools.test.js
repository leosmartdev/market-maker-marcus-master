const { parsePrices, getThreshold } = require('../src/tools')

describe('tools', () => {
  describe('parsePrices()', () => {
    it('should parse and sort buy and sell prices for a given pair', () => {
      const data = [
        [1503, 1, -2.9908],
        [1501.2, 2, 12.90743],
        [1502, 1, -0.6657],
        [1501.3, 3, 10.41419],
      ]
      const { sellBids, buyAsks } = parsePrices(data)

      expect(sellBids[0]).toEqual({
        price: 1502,
        count: 1,
        amount: -0.6657,
      })

      expect(buyAsks[0]).toEqual({
        price: 1501.3,
        count: 3,
        amount: 10.41419,
      })
    })
  })

  describe('getThreshold()', () => {
    const prices = [{ price: 1500 }, { price: 1501 }, { price: 1502 }]

    it('should get threshold for buy order price', () => {
      const { min, max, threshold, thresholdDiff } = getThreshold(prices, 'buy')

      expect(min).toEqual(1500)
      expect(max).toEqual(1502)
      expect(threshold).toEqual(1500.1)
      expect(thresholdDiff).toEqual(0.1)
    })

    it('should get threshold for sell order price', () => {
      const { min, max, threshold, thresholdDiff } = getThreshold(prices, 'sell')

      expect(min).toEqual(1500)
      expect(max).toEqual(1502)
      expect(threshold).toEqual(1501.9)
      expect(thresholdDiff).toEqual(0.1)
    })
  })
})
