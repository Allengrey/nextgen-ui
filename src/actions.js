export const REQUEST_MAIN_CONFIG = 'REQUEST_MAIN_CONFIG';
function requestMainConfig() {
  return { type: REQUEST_MAIN_CONFIG };
}

export const RECEIVE_TICKER = 'RECEIVE_TICKER';
export function receiveTicker(ticker) {
  return { type: RECEIVE_TICKER, ticker };
}

export const RECEIVE_TOKEN_LIST = 'RECEIVE_TOKEN_LIST';
function receiveTokenList(tokens) {
  return { type: RECEIVE_TOKEN_LIST, tokens };
}

export const RECEIVE_TRADES = 'RECEIVE_TRADES';
export function receiveTrades(trades) {
  return { type: RECEIVE_TRADES, trades };
}

export const RECEIVE_ORDERS = 'RECEIVE_ORDERS';
export function receiveOrders(direction, orders) {
  return { type: RECEIVE_ORDERS, direction, orders };
}

/* UI */
export const SET_TICKER_SORT_DIRECTION = 'SET_TICKER_SORT_DIRECTION';
export function setTickerSortDirection(field, direction) {
  return {
    type: SET_TICKER_SORT_DIRECTION,
    field,
    direction,
  };
}

export function fetchMainConfig(configUrl) {
  return dispatch => {
    dispatch(requestMainConfig());

    fetch(configUrl)
      .then(response => response.json())
      .then(({ bases, tokens }) => {
        dispatch(
          receiveTokenList(
            [...tokens, ...bases].reduce((memo, token) => {
              memo[token.addr] = token;
              return memo;
            }, {})
          )
        );
      });
  };
}
