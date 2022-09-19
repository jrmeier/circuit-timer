import React from 'react';
import './App.css';
import { Timer } from '../Timer/Timer';
import { BottomBar } from '../BottomBar/BottomBar';
import { Sessions } from '../Sessions/Sessions';


import { Redirect, Route } from 'wouter'

import { TimerContextProvider } from '../Timer/TimerContext';


function App() {

  return (
    <TimerContextProvider>
    <div className="App">
      <div className='container'>
        <Route path='/'>
          <Timer />
        </Route>
        <Route path='/circuit-timer'>
          <Redirect to='/' />
        </Route>
        <Route path='/sessions'>
          <Sessions />
        </Route>
        <BottomBar />
      </div>
  </div>
  </TimerContextProvider>
  );
}

export default App;
