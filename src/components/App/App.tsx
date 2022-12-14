import React from 'react';
import './App.css';
import { Timer } from '../Timer/Timer';
import { BottomBar } from '../BottomBar/BottomBar';
import { Sessions } from '../Sessions/Sessions';
import { TimerContextProvider } from '../Timer/TimerContext';

import { Route, Redirect } from 'wouter'
import { ActiveSession } from '../Sessions/ActiveSession';

function App() {

  return (
    <TimerContextProvider>
    <div className="App">
      <div className='container'>
        <Route path='/circuit-timer'>
          <Timer />
        </Route>
        <Route path='/circuit-timer/sessions'>
          <Sessions />
        </Route>
        <Route path='/circuit-timer/sessions/:sessionId'>
          {params => <ActiveSession sessionId={parseInt(params.sessionId)} />}
        </Route>

        <Route path='/'>
          <Redirect to='/circuit-timer/' />
        </Route>
        <BottomBar />
      </div>
  </div>
  </TimerContextProvider>
  );
}

export default App;
