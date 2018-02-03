import React from 'react';
import { connect } from 'react-redux';
import ReactTable from 'react-table';

import { setTickerSortDirection } from './actions';

import 'react-table/react-table.css';
import './Ticker.css';

const COLUMNS = [
  {
    Header: 'Name',
    id: 'name',
    accessor: d => d.name.replace('ETH_', ''),
    minWidth: 75,
  },
  {
    Header: 'Volume',
    id: 'baseVolume',
    accessor: d => Math.round(100 * d.baseVolume || 0.0) / 100,
    minWidth: 75,
  },
  /*{
    Header: 'Last',
    accessor: 'last',
    minWidth: 75,
  },*/
  {
    Header: 'Bid',
    accessor: 'bid',
    minWidth: 75,
  },
  {
    Header: 'Ask',
    accessor: 'ask',
    minWidth: 75,
  },
];
const DEFAULT_SORT = [{ id: 'baseVolume', desc: true }];
function TickerTable({ className, ticker, style = {} }) {
  return (
    <ReactTable
      data={ticker}
      minRows={10}
      defaultSorted={DEFAULT_SORT}
      columns={COLUMNS}
      defaultPageSize={1000}
      style={style}
      className="-striped -highlight"
    />
  );
}

const DEFAULT_COMPARATOR = function(key, direction) {
  return function(a, b) {
    const valA = a[key],
      valB = b[key];
    if (valA < valB) {
      return -1 * direction;
    }
    if (valA > valB) {
      return direction;
    }

    return 0;
  };
};

const COMPARATORS = {
  name: function(direction) {
    return function(a, b) {
      // Straight from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
      const nameA = a.name.toUpperCase(),
        nameB = b.name.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1 * direction;
      }
      if (nameA > nameB) {
        return direction;
      }

      // names must be equal
      return 0;
    };
  },
};

function mapStateToProps(state) {
  const { ticker: tickerObject, tickerOptions, tokens } = state,
    { sort, sortDirection } = tickerOptions;

  const comparator = COMPARATORS[sort]
    ? COMPARATORS[sort](sortDirection)
    : DEFAULT_COMPARATOR(sort, sortDirection);
  const ticker = Object.values(tickerObject).sort(comparator);

  return { ticker, tickerOptions, tokens };
}

function mapDispatchToProps(dispatch) {
  return {
    handleSortChange: (fromField, toField, fromDirection) => {
      if (fromField === toField) {
        dispatch(setTickerSortDirection(fromField, -1 * fromDirection));
      } else {
        dispatch(setTickerSortDirection(toField, -1));
      }
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TickerTable);
