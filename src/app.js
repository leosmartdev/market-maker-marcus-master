const { config } = require('./config')
const { ledger } = require('./ledger')
const { buy, sell, getLatestParsedData, getThreshold } = require('./tools')

let init = true

const run = async () => {
  try {
    console.log('---\nOpen orders:', {
      ASK: ledger.openOrders.filter((o) => o.type === 'ASK').length,
      BID: ledger.openOrders.filter((o) => o.type === 'BID').length,
    })
    // Get data
    const { sellBids, buyAsks } = await getLatestParsedData()

    // Get thresholds
    const sellBidThreshold = getThreshold(sellBids, 'buy')
    const buyAskThreshold = getThreshold(buyAsks, 'sell')

    // Get best 5% price range available liquidity
    const sellBidLiquidity = sellBids
      .filter((bid) => bid.price < sellBidThreshold.threshold)
      .reduce((acc, curr) => (acc += -curr.amount), 0)

    const buyAskLiquidity = buyAsks
      .filter((bid) => bid.price > buyAskThreshold.threshold)
      .reduce((acc, curr) => (acc += curr.amount), 0)

    // Place initial orders
    if (init) {
      // 5x Buy orders
      for (let i = 0; i < 5; i++) {
        buy(sellBidThreshold, sellBidLiquidity)
      }

      // 5x Sell orders
      for (let i = 0; i < 5; i++) {
        sell(buyAskThreshold, buyAskLiquidity)
      }

      init = false

      return
    }

    // Otherwise
    // check if/which placed orders can be fulfilled
    const fulfilledAskOrders = ledger.openOrders.filter(
      (o) => o.type === 'ASK' && o.price < sellBidThreshold.min,
    )
    const fulfilledBidOrders = ledger.openOrders.filter(
      (o) => o.type === 'BID' && o.price > buyAskThreshold.max,
    )

    console.log(
      'Fulfilled orders:',
      {
        ASK: fulfilledAskOrders.length,
        BID: fulfilledBidOrders.length,
      },
      '\n---',
    )

    fulfilledAskOrders.forEach((o) => ledger.fulfillOrder(o))
    fulfilledBidOrders.forEach((o) => ledger.fulfillOrder(o))

    // cancel orders falling over min/max range
    const askOrdersToCancel = ledger.openOrders.filter(
      (o) => o.type === 'ASK' && o.price > sellBidThreshold.max,
    )
    const bidOrdersToCancel = ledger.openOrders.filter(
      (o) => o.type === 'BID' && o.price < buyAskThreshold.min,
    )

    askOrdersToCancel.forEach((o) =>
      ledger.cancelOrder(o, sellBidThreshold.min),
    )
    bidOrdersToCancel.forEach((o) => ledger.cancelOrder(o, buyAskThreshold.max))

    // Place new orders if open order below minimum
    const openAsk = ledger.openOrders.filter((o) => o.type === 'ASK')
    const openBid = ledger.openOrders.filter((o) => o.type === 'BID')

    if (openAsk.length < config.MIN_OPEN_ORDERS) {
      for (let i = 0; i < config.MIN_OPEN_ORDERS; i++) {
        buy(sellBidThreshold, sellBidLiquidity)
      }
    }

    if (openBid.length < config.MIN_OPEN_ORDERS) {
      for (let i = 0; i < config.MIN_OPEN_ORDERS; i++) {
        sell(buyAskThreshold, buyAskLiquidity)
      }
    }
  } catch (err) {
    console.error(err.message)
  }
}

run().then(() => setInterval(run, 5000))
