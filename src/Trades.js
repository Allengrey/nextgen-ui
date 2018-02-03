import { format } from 'd3-format';
import React from 'react';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import RTPaginationComponent from './RTPaginationComponent';

import './Trades.css';

const formatPrice = format('.06f'),
  formatAmount = format('.03f');

const COLUMNS = [
  {
    Header: 'Amount Coin',
    accessor: 'amount',
    Cell: ({ value }) => <span title={value}>{formatAmount(value)}</span>,
    className: 'numeric',
  },
  {
    Header: 'Price',
    accessor: 'price',
    Cell: ({ value, original: { side } }) => (
      <span className={side} title={value}>
        {formatPrice(value)}
      </span>
    ),
    className: 'numeric',
  },
  {
    Header: 'Amount Base',
    accessor: 'amountBase',
    Cell: ({ value }) => <span title={value}>{formatAmount(value)}</span>,
    className: 'numeric',
  },
  {
    Header: 'Date',
    accessor: 'date',
    Cell: ({ value }) => (
      <span title={value}>
        {new Date().getTime() - value.getTime() > 86400000
          ? value.toLocaleDateString()
          : value.toLocaleTimeString()}
      </span>
    ),
    className: 'numeric',
  },
  {
    Header: '',
    id: 'txLink',
    accessor: ({ txHash }) => txHash,
    Cell: ({ value }) => (
      <a href={`https://etherscan.io/tx/${value}`}>
        <span className="pt-icon-standard pt-icon-link" />
      </a>
    ),
    width: 32,
  },
];

function TradesTable({ coin, data, tokens, style }) {
  return (
    <ReactTable
      PaginationComponent={RTPaginationComponent}
      data={data}
      columns={COLUMNS}
      minRows={14}
      defaultPageSize={14}
      sortable={false}
      className="trades -striped -highlight -condensed"
      style={{ height: '100%', ...style }}
      coin={coin}
    />
  );
}

export default TradesTable;
