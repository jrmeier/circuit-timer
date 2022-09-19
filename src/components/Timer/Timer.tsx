import React,  { useContext, useEffect, useState } from 'react';
import './Timer.css';

import { startSession, addRound, endSession, Round } from '../../db';

import { TimerContext, } from '../Timer/TimerContext';

interface TimerRound extends Round {
    updateTime: number
    lastStartTime: number
    color?: string
}

const DefaultTimerRound: TimerRound = {
    roundNum: 1,
    duration: 0,
    updateTime: 0,
    lastStartTime: 0,
}

export function Timer() {
    const {
        start,
        stop,
        pause,
        reset,
        isRunning,
        duration
    } = useContext(TimerContext)
    
      const [rounds, setRounds] = useState<TimerRound[]>([]);
      const [fastestRound, setFastestRound] = useState<TimerRound>(DefaultTimerRound);
      const[currentRound, setCurrentRound] = useState<TimerRound>(DefaultTimerRound);
      const [sessionId, setSessionId] = useState<number>(0);


    const handleRound = async () => {
        const newRounds = [
            ...rounds, 
            {
                ...currentRound,
            }
        ]

        // const newRounds = await newRound(currentRound)

        const fastestLap = newRounds.reduce((prev, current) => (prev.duration < current.duration) ? prev : current);
        // const slowestLap = newRounds.reduce((prev, current) => (prev.duration > current.duration) ? prev : current);

        const colorMap = [
            "#97db00",
            "#89e300",
            "#78eb00",
            "#60f304",
            "#00ff1e",
            "#6e0404",
            "#910207",
            "#a90106",
            "#c20004",
            "#db0000"
        ]

        const sortedRoundsWithColor = newRounds.map(r => {
            // const colorIndex = Math.floor((r.duration) * 10);
            const totalLaps = newRounds.length;
            const colorIndex = [...newRounds].sort((a, b) => a.duration - b.duration).findIndex(xr => r.roundNum === xr.roundNum)

            const rank = Math.floor((colorIndex / totalLaps) * 10);
            
            return {
                ...r,
                color: colorMap[rank]
            }
        })

        setFastestRound(fastestLap);
        setRounds(sortedRoundsWithColor);
        
        addRound({sessionId, round: currentRound});
        setCurrentRound({...DefaultTimerRound, roundNum: currentRound.roundNum + 1, lastStartTime: new Date().getTime()});

    }

    const createRoundItem = (round: TimerRound) => {
        return (
        <li
            className={`roundLi`}
            key={round.roundNum}
            >
            <span style={{ backgroundColor: round.color }}>{round.roundNum} - {convertTimeToString(round.duration)}</span>
        </li>
        )

    }

    const handleReset = () => {
        pause();
        setRounds([]);
        setFastestRound(DefaultTimerRound);
        setCurrentRound(DefaultTimerRound);
        reset();
    }

    // const handleStartPause = () => console.log('handleStartPause')

    const handleStartPause = async () => {
        if(sessionId && !isRunning) {
            
            start()
        } else if(sessionId && isRunning) {
            pause()
        } else {
            start()
            const session = await startSession({workoutId:'test'})
            setSessionId(session.sessionId);
        }
    }

    const handleEndSession = async () => {
        pause();
        await endSession({sessionId, currentRound});
    }

  
    return (
            <div className='timer'>
                <div className='buttons'>
                    <button onClick={handleStartPause}  className={`controlButton ${isRunning ? 'pauseButton' : 'startButton'} `}>{isRunning ? 'Pause' : 'Start'}</button>
                    <button onClick={handleEndSession} className="controlButton endButton">End</button>
                    <button onClick={handleReset} className="controlButton resetButton">Reset</button>
                </div>
                <h3>Total: {convertTimeToString(duration)}</h3>
                <h1>{currentRound.roundNum} - {convertTimeToString(currentRound.duration)}</h1>

                <div>
                    <button onClick={handleRound} className="controlButton roundButton" disabled={!isRunning}>NEXT ROUND</button>
                </div>
                <div>
                    Fastest round: {fastestRound.roundNum} {convertTimeToString(fastestRound.duration)}
                </div>
                <div>
                    <ul>
                    {/* <li className='roundLi' key={0}>{createRoundItem(currentRound)}</li> */}
                    {createRoundItem(currentRound)}
                    {rounds
                    .sort((a, b) => b.roundNum - a.roundNum)
                    .map(createRoundItem)
                    }
                    </ul>
                </div>
            </div>
  );
}

const convertTimeToString = (seconds: number) => {
    let minutes = 0
    if(seconds > 59) {
        minutes = Math.floor(seconds / 60);
        seconds = seconds % 60
    }

    const addLeadingZero = (num: number, fixed=0) => {
        let retNum
        if(num < 10) {
            retNum = `0${num.toFixed(fixed)}`
            // retNum = `0${num}` 
        } else {
            retNum = num.toFixed(fixed)
        }
        return retNum
    }
    return addLeadingZero(minutes) + ":" + addLeadingZero(seconds, 2)
  }