import { format } from 'd3-format';
import React from 'react';
import ReactTable from 'react-table';

/*import {
  Navbar as BlueprintNavbar,
  NavbarGroup,
  NavbarHeading,
} from '@blueprintjs/core';

import PairsPopover from './PairsPopover';
*/

import './OrderBook.css';

const	formatPrice = format('.09f'),
		formatAmount = format('.06f');

function SellOrders({ token, orders }) {
  return (
    <ReactTable
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
          Header: token,
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

function BuyOrders({ token, orders }) {
  return (
    <ReactTable
      data={orders}
      defaultSorted={[{ id: 'price', desc: true }, { id: 'ethAvailableVolume' }]}
      columns={[
        {
          Header: token,
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

function OrderBook({ token, buys, sells }) {
  return (
    <div className="order_book" style={{ display: 'flex', flexDirection: 'row' }}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="summary">
          <h6>Buying {token}</h6>
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
        <BuyOrders token={token} orders={buys} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="summary">
          <h6>Selling {token}</h6>
          <div>
            Total:{' '}
            {formatAmount(
              sells.reduce(
                (memo, { ethAvailableVolume }) => memo + parseFloat(ethAvailableVolume || 0.0),
                0.0
              )
            )}{' '}
            {token}
          </div>
        </div>
        <SellOrders token={token} orders={sells} />
      </div>
    </div>
  );
}

export default OrderBook;

