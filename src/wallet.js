const { config } = require('./config')

const wallet = {
  balance: { ...config.INITIAL_BALANCE },

  update(symbol, diff) {
    this.balance[symbol] += diff
  },

  reset() {
    this.balance = { ...config.INITIAL_BALANCE }
  },
}

setInterval(() => {
  console.log('--- Current balance:', wallet.balance)
}, 30 * 1000)

module.exports = {
  wallet,
}
