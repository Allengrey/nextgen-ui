import { format } from 'd3-format';
import React from 'react';
import ReactTable from 'react-table';
import RTPaginationComponent from './RTPaginationComponent';

import './Orders.css';

const formatPrice = format('.09f'),
  formatAmount = format('.06f');

function SellOrders({ coinName, orders }) {
  return (
    <ReactTable
      PaginationComponent={RTPaginationComponent}
      data={orders}
      defaultSorted={[{ id: 'price', desc: false }, { id: 'ethAvailableVolume' }]}
      columns={[
        {
          Header: 'Ask',
          id: 'price',
          accessor: ({ price }) => parseFloat(price),
          Cell: ({ original: { price: value } }) => formatPrice(value),
          className: 'numeric',
        },
        {
          Header: 'ETH',
          id: 'ethAvailableVolumeBase',
          accessor: ({ ethAvailableVolumeBase }) => parseFloat(ethAvailableVolumeBase),
          Cell: ({ original: { ethAvailableVolumeBase: value } }) => formatAmount(value),
          className: 'numeric',
        },
        {
          Header: coinName,
          id: 'ethAvailableVolume',
          accessor: ({ ethAvailableVolume }) => parseFloat(ethAvailableVolume),
          Cell: ({ original: { ethAvailableVolume: value } }) => formatAmount(value),
        },
      ]}
      minRows={12}
      defaultPageSize={12}
      className="-striped -highlight -condensed sells"
    />
  );
}

function BuyOrders({ coinName, orders }) {
  return (
    <ReactTable
      PaginationComponent={RTPaginationComponent}
      data={orders}
      defaultSorted={[{ id: 'price', desc: true }, { id: 'ethAvailableVolume' }]}
      columns={[
        {
          Header: coinName,
          id: 'ethAvailableVolume',
          accessor: ({ ethAvailableVolume }) => parseFloat(ethAvailableVolume),
          Cell: ({ original: { ethAvailableVolume: value } }) => formatAmount(value),
        },
        {
          Header: 'ETH',
          id: 'ethAvailableVolumeBase',
          accessor: ({ ethAvailableVolumeBase }) => parseFloat(ethAvailableVolumeBase),
          Cell: ({ original: { ethAvailableVolumeBase: value } }) => formatAmount(value),
          className: 'numeric',
        },
        {
          Header: 'Bid',
          id: 'price',
          accessor: ({ price }) => parseFloat(price),
          Cell: ({ original: { price: value } }) => formatPrice(value),
          className: 'numeric',
        },
      ]}
      minRows={12}
      defaultPageSize={12}
      className="-striped -highlight -condensed buys"
    />
  );
}

function Orders({ coinName, buys, sells }) {
  return (
    <div className="orders" style={{ display: 'flex', flexDirection: 'row' }}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="summary">
          <h6>Buying {coinName}</h6>
          <div>
            Total:{' '}
            {formatAmount(
              buys.reduce(
                (memo, { ethAvailableVolumeBase }) =>
                  memo + parseFloat(ethAvailableVolumeBase || 0.0),
                0.0
              )
            )}{' '}
            ETH
          </div>
        </div>
        <BuyOrders coinName={coinName} orders={buys} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="summary">
          <h6>Selling {coinName}</h6>
          <div>
            Total:{' '}
            {formatAmount(
              sells.reduce(
                (memo, { ethAvailableVolume }) => memo + parseFloat(ethAvailableVolume || 0.0),
                0.0
              )
            )}{' '}
            {coinName}
          </div>
        </div>
        <SellOrders coinName={coinName} orders={sells} />
      </div>
    </div>
  );
}

export default Orders;
