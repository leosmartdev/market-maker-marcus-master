const { wallet } = require('../src/wallet')

describe('wallet', () => {
  beforeEach(() => {
    wallet.reset()
  })

  it('should have initial balance of 10 ETH and 2000 USDT', () => {
    expect(wallet.balance).toEqual({
      ETH: 10,
      USDT: 2000,
    })
  })

  it('should update balance given a symbol and positive amount', () => {
    wallet.update('ETH', 5)
    expect(wallet.balance.ETH).toEqual(15)
  })

  it('should update balance given a symbol and negative amount', () => {
    wallet.update('USDT', -500)
    expect(wallet.balance.USDT).toEqual(1500)
  })
})
