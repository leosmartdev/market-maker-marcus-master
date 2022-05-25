const uuid = require('uuid')
const { wallet } = require('./wallet')

const prefix = '[ ORDER PLACED ]'

const ledger = {
  openOrders: [],
  fulfilledOrders: [],
  canceledOrders: [],

  placeOrder(order) {
    this.openOrders.push({ id: uuid.v4(), ...order })

    console.log(
      `${prefix} [ ${order.type} ] ${order.amount1} ETH @ ${order.price} for ${order.amount2} USDT`,
    )
  },

  fulfillOrder(order) {
    this.openOrders = this.openOrders.filter((o) => o.id !== order.id)
    this.fulfilledOrders.push(order)

    console.log(
      `[ ORDER FULFILLED ] [ ${order.type} ] ${order.amount1} ETH @ ${order.price} for ${order.amount2} USDT`,
    )

    if (order.type === 'ASK') {
      wallet.update('ETH', order.amount1)
      wallet.update('USDT', -order.amount2)
    } else if (order.type === 'BID') {
      wallet.update('USDT', order.amount2)
      wallet.update('ETH', -order.amount1)
    }
  },

  cancelOrder(order, currentPrice) {
    this.canceledOrders.push(order)
    this.openOrders = this.openOrders.filter((o) => o.id !== order.id)

    console.log(
      `[ ORDER CANCELED ] [ ${order.type} ] ${order.amount1} ETH @ ${order.price} (${currentPrice}) for ${order.amount2} USDT`,
    )
  },

  reset() {
    this.openOrders = []
    this.fulfilledOrders = []
  },
}

module.exports = { ledger }
