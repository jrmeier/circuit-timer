import React from 'react';
import './App.css';
import { Timer } from '../Timer/Timer';
import { BottomBar } from '../BottomBar/BottomBar';
import { Sessions } from '../Sessions/Sessions';


import { Route, Redirect } from 'wouter'

function App() {

  return (
    <div className="App">
      <div className='container'>
        <Route path='/circuit-timer'>
          <Timer />
        </Route>
        <Route path='/circuit-timer/sessions'>
          <Sessions />
        </Route>
        <Route path='/'>
          <Redirect to='/circuit-timer/' />
        </Route>
        <BottomBar />
      </div>
  </div>
  );
}

export default App;
