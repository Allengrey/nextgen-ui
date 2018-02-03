import React from 'react';
import Ticker from './Ticker';
import Trades from './Trades';
import './App.css';

function App() {
  return (
    <div className="App">
      <div>
        <Ticker />
      </div>
      <div>
        <Trades />
      </div>
    </div>
  );
}

export default App;
