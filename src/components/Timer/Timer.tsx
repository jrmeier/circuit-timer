import {  useContext, useEffect, useState } from 'react';
import './Timer.css';

import { TimerContext, } from './TimerContext';
import { TimerRound } from './TimerRoundTypes';
import { formatMSToDisplay } from '../../formatMSToDisplay';

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
        rounds,
        removeRound,
        avgRoundTime
    } = useContext(TimerContext)
    
    const [fastestRound, setFastestRound] = useState<TimerRound>({...currentRound, duration: 0});

    
    const createRoundItem = (round: TimerRound) => {
        return (
        <li
            className={`roundLi`}
            key={round.roundNum}
            >
            <span style={{ backgroundColor: ROUND_COLOR_MAP[round.rank], color: 'black' }}>{round.roundNum} - {formatMSToDisplay(round.duration)}</span>
            {round.roundNum === currentRound.roundNum - 1 ? <span onClick={() => removeRound(round.roundNum) }> X</span> : '' } 
        </li>
        )
    }

    useEffect(() => {
        if (rounds.length > 0) {
            const fastestRound = rounds.reduce((prev, current) => (prev.duration < current.duration) ? prev : current)
            setFastestRound(fastestRound)
        }
    }, [rounds, setFastestRound])
  
    return (
            <div className='timer'>
                <div className='buttons'>
                    <button onClick={() => startPause()}  className={`controlButton ${isRunning ? 'pauseButton' : 'startButton'} `}>{isRunning ? 'Pause' : 'Start'}</button>
                    <button onClick={() => endSession()} className="controlButton endButton" disabled={!currentRound.duration}>End</button>
                    <button onClick={() => reset()} className="controlButton resetButton">Reset</button>
                </div>
                <h1>{formatMSToDisplay(duration)}</h1>
                <h1 className="displayTime">{currentRound.roundNum} - {formatMSToDisplay(currentRound.duration)}</h1>

                <div>
                    <button onClick={() =>nextRound()} className="controlButton roundButton" disabled={!isRunning}>NEXT ROUND</button>
                </div>
                <div>
                    Fastest round: {fastestRound.roundNum} {formatMSToDisplay(fastestRound.duration)}
                </div>
                <div>
                    Avg round time: {formatMSToDisplay(avgRoundTime)}
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
