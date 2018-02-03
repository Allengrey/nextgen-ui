import React from 'react';
import {
  Button,
  Intent,
  Navbar,
  NavbarGroup,
  NavbarDivider,
  NavbarHeading,
} from '@blueprintjs/core';
import { AnchorButton, Menu, MenuItem } from '@blueprintjs/core';
import { Popover2 } from '@blueprintjs/labs';
import { Overlay, Spinner } from '@blueprintjs/core';

import { connect } from 'react-redux';

import Ticker from './Ticker';

function TokenSelectorMenu({ tokens = {} }) {
  return (
    <Menu>
      {Object.entries(tokens).map(([key, tokenInfo]) => (
        <MenuItem href={`/trade/${tokenInfo.name}`} text={tokenInfo.name} />
      ))}
    </Menu>
  );
}

const TokenSelector = connect(state => {
  const { tokens } = state;
  return { tokens };
})(function({ tokens }) {
  const ticker = <Ticker className="pt-dark" style={{ height: '400px' }} />;
  return (
    <Popover2 inline={true} content={ticker} placement="bottom-start">
      <AnchorButton rightIconName="caret-down" text="Trading Pairs" />
    </Popover2>
  );
});

function MyNavbar() {
  return (
    <Navbar className="pt-fixed-top pt-dark">
      <NavbarGroup>
        <NavbarHeading>DeltaFork</NavbarHeading>
        <NavbarDivider />
      </NavbarGroup>
      <NavbarGroup>
        <TokenSelector />
      </NavbarGroup>
      <NavbarGroup align="right">
        {/*<Button
          className="start-trading"
          iconName="hand-right"
          text="Start Trading Now"
          intent={Intent.WARNING}
        />
        <NavbarDivider />*/}
        <Button iconName="bank-account" text="My funds" intent={Intent.PRIMARY} />
        <NavbarDivider />
        <Button className="pt-minimal" iconName="user" />
        <Button className="pt-minimal" iconName="notifications" />
        <Button className="pt-minimal" iconName="cog" />
      </NavbarGroup>
    </Navbar>
  );
}

const WebsocketStatusOverlay = connect(state => {
  return { status: state.websocket };
})(function({ status }) {
  return (
    <Overlay canEscapeKeyClose={false} canOutsideClickClose={false} isOpen={status !== 'connected'}>
      <div
        className="pt-card pt-elevation-4"
        style={{
          display: 'flex',
          height: '150px',
          width: '300px',
          top: 'calc(50% - 75px)',
          left: 'calc(50% - 150px)',
          flex: 1,
          justifyContent: 'space-around',
          alignItems: 'center',
        }}>
        <div style={{ display: 'flex' }}>
          <Spinner />
        </div>
        <div style={{ display: 'flex' }}>Connecting to EtherDelta...</div>
      </div>
    </Overlay>
  );
});

function Shell({ children }) {
  return (
    <div>
      <MyNavbar />
      {children}
      <WebsocketStatusOverlay />
    </div>
  );
}

export default Shell;
