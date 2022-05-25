const config = {
  API: 'https://api.deversifi.com/market-data/book/{PAIR}/P0',
  INITIAL_BALANCE: {
    ETH: 10,
    USDT: 2000,
  },
  TRADABLE_PERCENTAGE: 0.1,
  GOOD_PRICE_RANGE: 0.05,
  MIN_OPEN_ORDERS: 4,
}

module.exports = {
  config,
}
