import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Position, Spinner, Tooltip } from '@blueprintjs/core';

import Chart from './Chart';
import Orders from './Orders';
import Ticker from './Ticker';
import Trades from './Trades';

export function getData(coin) {
  const promiseIntraDayContinuous = fetch(
    `https://min-api.cryptocompare.com/data/histominute?aggregate=30&e=EtherDelta&extraParams=CryptoCompare&fsym=${coin}&limit=100&tryConversion=false&tsym=ETH`
  )
    .then(response => response.json())
    .then(responseJSON =>
      responseJSON['Data'].map(entry => {
        return {
          ...entry,
          date: new Date(entry.time * 1000.0),
          volume: entry.volumefrom + entry.volumeto,
        };
      })
    );
  return promiseIntraDayContinuous;
}

function VerifiedContract({ coinName }) {
  return (
    <Tooltip
      content={`${coinName} listing was verified by the community`}
      position={Position.RIGHT}>
      <span
        className="pt-icon-large pt-icon-endorsed pt-intent-primary"
        style={{ verticalAlign: 'top', fontSize: '20px', margin: '3px 0px 0px 3px' }}
      />
    </Tooltip>
  );
}

function AboutCoin({ coin }) {
  return (
    <div
      className="panel"
      style={{
        maxWidth: '280px',
      }}>
      <h4>About {coin}</h4>
      <img
        style={{ width: '180px', height: '180px', alignSelf: 'center' }}
        src="https://www.cryptocompare.com/media/1383731/kin.png?width=180"
        alt={coin}
      />
      <h1 style={{ lineHeight: 1, margin: '10px 5px 0px' }}>
        {coin}
        <VerifiedContract coinName={coin} />
      </h1>
      <div id="thing" className="pt-ui-text pt-text-muted" style={{ display: 'block' }}>
        <p>A decentralized ecosystem of digital services for daily life.</p>
        <a href="https://kin.kik.com">» Visit kin.kik.com</a>{' '}
        <a href="https://kin.kik.com/Kin%20Whitepaper%20v1.pdf">» Whitepaper</a>{' '}
        <a href="https://etherscan.io/token/0x818fc6c2ec5986bc6e2cbf00939d90556ab12ce5">
          » Smart contract
        </a>
      </div>
    </div>
  );
}

function ChartPanel({ coin, data }) {
  return (
    <div className="panel" style={{ flexGrow: 2, maxWidth: '60vw', minWidth: '500px' }}>
      <h4>Chart (30m)</h4>
      <div style={{ boxSizing: 'content-box' }}>
        {(!!data &&
          data.length > 0 && (
            <div style={{ padding: '10px 3px' }}>
              <Chart type="hybrid" seriesName={coin} data={data} height={428} />
            </div>
          )) || (
          <Spinner
            style={{
              display: 'flex',
              alignSelf: 'center',
            }}
          />
        )}
      </div>
    </div>
  );
}

function OrderBookPanel({ coin, sells, buys }) {
  return (
    <div className="panel">
      <h4>Order Book</h4>
      <Orders coinName={coin} sells={sells} buys={buys} />
    </div>
  );
}

class Trader extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { coin } = this.props.match.params;

    setTimeout(() => {
      getData(coin).then(olhcv => {
        this.setState({ olhcv });
      });
    }, 5000);
  }

  render() {
    const { coin } = this.props.match.params,
      { sells, buys, trades } = this.props,
      { olhcv } = this.state;

    /*<div className="panel" style={{ flex: 1 }}>
        <h4>Instruments</h4>
        <Ticker style={{ width: '100%', height: '430px' }} />
      </div>*/

    return (
      <div style={{ display: 'flex', flex: 'auto', flexDirection: 'column' }}>
        <div
          style={{
            display: 'flex',
            flex: 'auto',
            flexDirection: 'row',
            alignItems: 'flex-start',
          }}>
          <AboutCoin coin={coin} />

          <ChartPanel coin={coin} data={olhcv} />
          <div
            className="panel"
            style={
              {
                /* width: '300px' */
              }
            }>
            <h4>Trades</h4>
            <Trades coin={coin} data={trades} style={{ height: '448px' }} />
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            flex: 'auto',
            flexDirection: 'row',
            alignItems: 'flex-start',
          }}>
          <OrderBookPanel coin={coin} sells={sells} buys={buys} />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    sells: Object.values(state.orders).filter(({ deleted, side }) => !deleted && side === 'sell'),
    buys: Object.values(state.orders).filter(({ deleted, side }) => !deleted && side === 'buy'),
    trades: Object.values(state.trades).sort(({ ts: tsA }, { ts: tsB }) => tsB - tsA),
  };
}
export default connect(mapStateToProps)(Trader);
