import React,  { useContext, useEffect, useState } from 'react';
import './Timer.css';

import { TimerContext, TimerRound, DefaultTimerRound } from '../Timer/TimerContext';

const ROUND_COLOR_MAP = [
    "#00ff1e", // dark green
    "#89e300",
    "#78eb00",
    "#60f304",
    "#97db00", // bright green
    "#db0000", // bright red
    "#a90106",
    "#910207",
    "#c20004",
    "#6e0404", // dark red
]

export function Timer() {
    const {
        reset,
        isRunning,
        duration,
        currentRound,
        nextRound,
        startPause,
        endSession,
        rounds
    } = useContext(TimerContext)
    
      const [fastestRound, setFastestRound] = useState<TimerRound>(DefaultTimerRound);
    //   const [sortedRoundsWithColor, setSortedRoundsWithColor] = useState<TimerRound[]>([]);
  
    return (
            <div className='timer'>
                <div className='buttons'>
                    <button onClick={() => startPause()}  className={`controlButton ${isRunning ? 'pauseButton' : 'startButton'} `}>{isRunning ? 'Pause' : 'Start'}</button>
                    <button onClick={() => endSession()} className="controlButton endButton">End</button>
                    <button onClick={() => reset()} className="controlButton resetButton">Reset</button>
                </div>
                <h3>Total: {convertTimeToString(duration)}</h3>
                <h1>{currentRound.roundNum} - {convertTimeToString(currentRound.duration)}</h1>

                <div>
                    <button onClick={() =>nextRound()} className="controlButton roundButton" disabled={!isRunning}>NEXT ROUND</button>
                </div>
                <div>
                    Fastest round: {fastestRound.roundNum} {convertTimeToString(fastestRound.duration)}
                </div>
                <div>
                    <ul>
                        {createRoundItem(currentRound)}
                        {
                            rounds
                            .sort((a, b) => b.roundNum - a.roundNum)
                            .map(createRoundItem)
                        }
                    </ul>
                </div>
            </div>
  );
}

const convertTimeToString = (ms: number) => {
    const secondsInt = Math.floor(ms / 1000)
    let minutesInt = Math.floor(secondsInt / 60);
    const displaySeconds = secondsInt % 60;

    const addLeadingZero = (num: number, fixed=0) => {
        let retNum
        if(num < 10) {
            retNum = `0${num}`
        } else {
            retNum = num
        }
        return retNum
    }
    return addLeadingZero(minutesInt) + ":" + addLeadingZero(displaySeconds, 2) + ":" + addLeadingZero(ms % 1000, 3)
  }

const createRoundItem = (round: TimerRound) => {
    return (
    <li
        className={`roundLi`}
        key={round.roundNum}
        >
        <span style={{ backgroundColor: ROUND_COLOR_MAP[round.rank] }}>{round.roundNum} - {convertTimeToString(round.duration)}</span>
    </li>
    )
}