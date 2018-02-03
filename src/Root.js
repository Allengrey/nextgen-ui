import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
// import Web3 from 'web3';

import { fetchMainConfig } from './actions';
import { receiveOrders, receiveTicker, receiveTrades } from './actions'; // Socket-driven actions
import { MAIN_CONFIG_URL } from './constants';
import configureStore from './configureStore';
import App from './App';
import Shell from './Shell';
import Trader from './Trader';

import io from 'socket.io-client'; // TODO: Move with socket code

// if (typeof web3 === 'object') {
//   window.web3 = new Web3(window.web3.currentProvider);
// } else {
//   window.web3 = new Web3(new Web3.providers.HttpProvider(ETH_API_URL));
// }
//
// window.web3.eth.getBlockNumber().then(console.log);

const store = configureStore(),
  { dispatch } = store;
dispatch(fetchMainConfig(MAIN_CONFIG_URL));

const SOCKET_URL = 'https://socket04.etherdelta.com';
const DUMMY_TOKEN_ADDR = '0x419c4db4b9e25d6db2ad9691ccb832c8d9fda05e';
const TICKER_REFRESH_INTERVAL = 10000;

const socket = io.connect(SOCKET_URL, { transports: ['websocket'], timeout: 5000 });

function normalizeOrders(orders) {
  return orders.reduce(function(memo, order) {
    const { tokenGet, tokenGive, user } = order,
      orderUpdatedDate = new Date(order.updated);

    delete order.tokenGet;
    delete order.tokenGive;
    delete order.user;

    memo[order.id] = {
      ...order,
      side: order.id.endsWith('buy') ? 'buy' : order.id.endsWith('sell') ? 'sell' : undefined,
      tokenGetAddr: tokenGet,
      tokenGiveAddr: tokenGive,
      userAddr: user,
      date: orderUpdatedDate,
      ts: orderUpdatedDate.getTime(),
    };

    return memo;
  }, {});
}

socket.on('market', ({ orders, returnTicker, trades: tradesArray }) => {
  if (returnTicker) {
    const ticker = Object.entries(returnTicker).reduce((memo, [name, details]) => {
      memo[details.tokenAddr] = {
        ...details,
        name: name,
        percentChange: details.percentChange || 0.0,
      };
      return memo;
    }, {});
    dispatch(receiveTicker(ticker));
  }

  if (tradesArray) {
    const trades = tradesArray.reduce((memo, trade) => {
      const tradeDate = new Date(trade.date);
      memo[trade.txHash] = { ...trade, date: tradeDate, ts: tradeDate.getTime() };
      return memo;
    }, {});
    dispatch(receiveTrades(trades));
  }

  if (orders) {
    const { buys = [], sells = [] } = orders;

    console.log('Received orders', buys.length, 'buys', sells.length, 'sells');
    console.log(orders);

    dispatch(receiveOrders('buys', normalizeOrders(buys)));
    dispatch(receiveOrders('sells', normalizeOrders(sells)));
  }
});

socket.on('trades', tradesArray => {
  console.log('Received', tradesArray.length, 'trades');
  console.log(tradesArray);
  const trades = tradesArray.reduce((memo, trade) => {
    const tradeDate = new Date(trade.date);
    memo[trade.txHash] = { ...trade, date: tradeDate, ts: tradeDate.getTime() };
    return memo;
  }, {});
  // dispatch(receiveTrades(trades));
});

socket.on('orders', orders => {
  const { buys = [], sells = [] } = orders;

  console.log('Received orders', buys.length, 'buys', sells.length, 'sells');
  console.log(orders);

  // dispatch(receiveOrders('buys', normalizeOrders(buys)));
  // dispatch(receiveOrders('sells', normalizeOrders(sells)));
});

var getMarketInterval = null;
socket.on('connect', () => {
  console.log('Socket connected!');
  dispatch({ type: 'WEBSOCKET_STATUS', value: 'connected' });

  getMarketInterval =
    getMarketInterval ||
    setInterval(() => {
      socket.emit('getMarket', {
        token: DUMMY_TOKEN_ADDR,
      });
    }, TICKER_REFRESH_INTERVAL);

  // socket.emit('getMarket', { token: DUMMY_TOKEN_ADDR });
  socket.emit('getMarket', { token: DUMMY_TOKEN_ADDR });
});

socket.on('disconnect', reason => {
  dispatch({ type: 'WEBSOCKET_STATUS', value: 'disconnected' });
});

class Root extends Component {
  render() {
    console.log(this.props.config);
    return (
      <Provider store={store}>
        <Router>
          <Shell>
            <Switch>
              <Route exact path="/" component={App} />
              <Route exact path="/trade/:coin" component={Trader} />
            </Switch>
          </Shell>
        </Router>
      </Provider>
    );
  }
}

export default Root;
