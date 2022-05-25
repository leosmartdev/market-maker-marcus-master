const { config } = require('../config')
const { ledger } = require('../ledger')
const { wallet } = require('../wallet')

const sell = (askThreshold, liquidity) => {
  const inOpenOrders = ledger.openOrders.reduce(
    (acc, curr) => (acc += curr.type === 'BID' ? curr.amount1 : 0),
    0,
  )

  const sellTradeAmount =
    (wallet.balance.ETH - inOpenOrders) * config.TRADABLE_PERCENTAGE

  // skip if tryna sell more than good price liquidity
  if (sellTradeAmount > liquidity) {
    console.log('Cant sell because good price liquidity exceeded')
    return
  }

  const randomSpreadSellPrice =
    askThreshold.max - Math.random() * askThreshold.thresholdDiff

  const toBeGotten = sellTradeAmount * randomSpreadSellPrice

  // Place order
  ledger.placeOrder({
    type: 'BID',
    price: randomSpreadSellPrice,
    amount1: sellTradeAmount,
    amount2: toBeGotten,
  })

  // Deduct from liquidity
  liquidity -= sellTradeAmount
}

module.exports = {
  sell,
}
