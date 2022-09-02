import React from 'react';
import './App.css';
import { Timer } from './Timer';


function App() {
  return (
    <div className="App">
    <header className="App-header">
      <h1>
        Circuit Timer
      </h1>
    </header>
    <div className='container'>
      {/* <BigTimer /> */}
      <Timer />
    </div>
  </div>
  );
}

export default App;
