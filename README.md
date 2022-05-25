# Market Making Bot - Marcus

Simple market making bot that every 5 seconds decides on either buying or selling based on price conditions, while canceling unfulfilled orders and placing new ones to keep up to minimum set open orders. Also bot uses prices that range in the best 5% and checks available bid/ask liquidity before posting orders, that might exceed it. For each trade bot uses 10% of available token balance, which amongst other things can be adjusted in config file.

## Installation

```sh
$ yarn
```

## Usage

```sh
$ yarn start
```

## Testing

```sh
$ yarn test
```

## Possible Improvements

- Add techical indicator algorithms that can use historical data and indicate possible buy/sell opportunities
- Configure a list of pairs [+ add balances] and loop over those to increase the exposure
- Adjust refresh rate to increase market monitoring speed
- Add simple frontend that can visualize process in real time, view balances, stop/start bot
