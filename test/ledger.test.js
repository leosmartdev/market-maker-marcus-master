const { ledger } = require('../src/ledger')
const { wallet } = require('../src/wallet')

const testOrder = {
  type: 'ASK',
  price: 1476.1497473545064,
  amount1: 0.13548760913886385,
  amount2: 200,
}

describe('ledger', () => {
  beforeEach(() => {
    ledger.reset()
    wallet.reset()
    console.log = jest.fn()
  })

  it('should not have any initial orders', () => {
    expect(ledger.openOrders.length).toEqual(0)
    expect(ledger.fulfilledOrders.length).toEqual(0)
  })

  it('should place open order', () => {
    ledger.placeOrder(testOrder)

    expect(ledger.openOrders.length).toEqual(1)
    expect(ledger.openOrders[0].id).toBeDefined()
  })

  it('should fulfill order', () => {
    ledger.placeOrder(testOrder)
    ledger.fulfillOrder(ledger.openOrders[0])

    expect(ledger.openOrders.length).toEqual(0)
    expect(ledger.fulfillOrder.length).toEqual(1)
  })

  it('should update balance after fulfilling order', () => {
    ledger.placeOrder(testOrder)
    ledger.fulfillOrder(ledger.openOrders[0])

    expect(wallet.balance.ETH).toEqual(10.135487609138863)
    expect(wallet.balance.USDT).toEqual(1800)
  })
  
})
