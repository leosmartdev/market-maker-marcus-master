const { config } = require('../config')
const { ledger } = require('../ledger')
const { wallet } = require('../wallet')

const buy = (bidThreshold, liquidity) => {
  const inOpenOrders = ledger.openOrders.reduce(
    (acc, curr) => (acc += curr.type === 'ASK' ? curr.amount2 : 0),
    0,
  )

  const buyTradeAmount =
    (wallet.balance.USDT - inOpenOrders) * config.TRADABLE_PERCENTAGE

  const randomSpreadBuyPrice =
    bidThreshold.min + Math.random() * bidThreshold.thresholdDiff

  const toBeBought = buyTradeAmount / randomSpreadBuyPrice

  // skip if good price liquidity is exceeded
  if (toBeBought > liquidity) {
    console.log('Cant buy because good price liquidity exceeded')
    return
  }

  // Place order
  ledger.placeOrder({
    type: 'ASK',
    price: randomSpreadBuyPrice,
    amount1: toBeBought,
    amount2: buyTradeAmount,
  })

  // Deduct from liquidity
  liquidity -= toBeBought
}

module.exports = {
  buy,
}
