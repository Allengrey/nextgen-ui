import { combineReducers } from 'redux';
import { RECEIVE_TOKEN_LIST, RECEIVE_ORDERS, RECEIVE_TICKER, RECEIVE_TRADES } from './actions';
import { SET_TICKER_SORT_DIRECTION } from './actions';

function websocket(state = null, action) {
  switch (action.type) {
    case 'WEBSOCKET_STATUS':
      return action.value;
    default:
      return state;
  }
}

function ticker(state = {}, action) {
  switch (action.type) {
    case RECEIVE_TICKER:
      return action.ticker;
    case RECEIVE_TRADES: {
      const updatesByTrade = Object.values(action.trades).reduce((memo, trade) => {
        if (!state[trade.tokenAddr]) return memo;
        const { tokenAddr, baseVolume } = state[trade.tokenAddr];

        memo[tokenAddr] = {
          ...state[tokenAddr],
          last: parseFloat(trade.price),
          baseVolume: baseVolume + parseFloat(trade.amountBase), // NOT ENTIRELY ACCURATE
        };
        return memo;
      }, {});
      return { ...state, ...updatesByTrade };
    }
    case RECEIVE_ORDERS: {
      const updatesByOrder = Object.values(action.orders).reduce((memo, order) => {
        const tokenAddr = order.side === 'buy' ? order.tokenGetAddr : order.tokenGiveAddr,
          tickerDestinationKey = order.side === 'buy' ? 'bid' : 'ask';
        if (!state[tokenAddr]) return memo;
        memo[tokenAddr] = { ...state[tokenAddr], [tickerDestinationKey]: order.price };
        return memo;
      }, {});

      return { ...state, ...updatesByOrder };
    }
    default:
      return state;
  }
}

function tokens(state = {}, action) {
  switch (action.type) {
    case RECEIVE_TOKEN_LIST:
      return action.tokens;
    default:
      return state;
  }
}

function trades(state = {}, action) {
  switch (action.type) {
    case RECEIVE_TRADES:
      return { ...state, ...action.trades };
    default:
      return state;
  }
}

function orders(state = {}, action) {
  switch (action.type) {
    case RECEIVE_ORDERS:
      return { ...state, ...action.orders };
    default:
      return state;
  }
}

/* UI */
function tickerOptions(state = { sort: 'baseVolume', sortDirection: -1 }, action) {
  switch (action.type) {
    case SET_TICKER_SORT_DIRECTION:
      return { ...state, sort: action.field, sortDirection: action.direction };
    default:
      return state;
  }
}
const rootReducer = combineReducers({
  websocket,
  ticker,
  tokens,
  trades,
  orders,

  /* UI */
  tickerOptions,
});

export default rootReducer;
