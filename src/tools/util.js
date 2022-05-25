const axios = require('axios')
const { config } = require('../config')

const getPricesData = async (pair) => {
  try {
    const url = config.API.replace('{PAIR}', pair)
    const { data } = await axios.get(url)

    return data
  } catch (err) {
    console.error(err.message)
    return null
  }
}

const parsePrices = (data) => {
  const prices = data.map((i) => ({
    price: i[0],
    count: i[1],
    amount: i[2],
  }))

  const sellBids = prices
    .filter((r) => r.amount < 0)
    .sort((a, b) => a.price - b.price)
  const buyAsks = prices
    .filter((r) => r.amount > 0)
    .sort((a, b) => b.price - a.price)

  return {
    sellBids,
    buyAsks,
  }
}

const getLatestParsedData = async () => {
  // Get data
  const data = await getPricesData('ETH:USDT')
  if (!data) return { sellBids: null, buyAsks: null }

  // Parse data
  const { sellBids, buyAsks } = parsePrices(data)

  return { sellBids, buyAsks }
}

const getThreshold = (data, intention) => {
  if (!intention) return

  const parsed = data.map((d) => d.price)

  const min = Math.min(...parsed)
  const max = Math.max(...parsed)

  const diff = max - min

  const threshold = diff * config.GOOD_PRICE_RANGE

  return {
    min,
    max,
    threshold: intention === 'buy' ? min + threshold : max - threshold,
    thresholdDiff: threshold,
  }
}

module.exports = {
  parsePrices,
  getPricesData,
  getLatestParsedData,
  getThreshold,
}
