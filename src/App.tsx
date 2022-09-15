import React from 'react';
import './App.css';
import { Timer } from './Timer';
import { BottomBar } from './BottomBar';


function App() {

  return (
    <div className="App">
      <div className='container'>
        <Timer />
        <BottomBar />
      </div>
  </div>
  );
}

export default App;
