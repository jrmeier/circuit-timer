import React,  { useEffect, useState } from 'react';
import { useStopwatch } from 'react-timer-hook'
import './Timer.css';

import { startSession, addRound, endSession, Round } from './dbHelpers';

interface TimerRound extends Round {
    updateTime: number
    color?: string
}

export function Timer() {
    const {
        seconds,
        minutes,
        hours,
        // days,
        isRunning,
        start,
        pause,
        reset,
      } = useStopwatch({ autoStart: false });


      const [rounds, setRounds] = useState<TimerRound[]>([]);
      const [fastestRound, setFastestRound] = useState<TimerRound>({roundNum: 1, duration: 0, updateTime: 0});
      const[currentRound, setCurrentRound] = useState<TimerRound>({roundNum: 1, duration: 0, updateTime: 0});
      const [sessionId, setSessionId] = useState<number>(0);

    const convertTimeToString = (seconds: number) => {
        let minutes = 0
        if(seconds > 60) {
            minutes = Math.floor(seconds / 60);
            seconds = seconds % 60;
        }
  
        const addLeadingZero = (num: number) => num < 10 ? `0${num}` : num;
        return addLeadingZero(minutes) + ":" + addLeadingZero(seconds)
      }
    const handleRound = async () => {
        const newRounds = [
            ...rounds, 
            {
                ...currentRound,
            }
        ]

        const fastestLap = newRounds.reduce((prev, current) => (prev.duration < current.duration) ? prev : current);
        const slowestLap = newRounds.reduce((prev, current) => (prev.duration > current.duration) ? prev : current);

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
        // const sortedRoundsWithColor = newRounds.sort((a, b) => a.duration - b.duration)
        // .map((round,idx) => {
        //     const rank = Math.floor(((idx / newRounds.length) * 10));
        //     console.log({rank, round})
        //     // const wtf = Math.floor((idx/(newRounds.length) * 100) % colorMap.length)
        //     // console.log({round})
            

        //     // console.log({wtf})
        //     return {
        //         ...round,
        //         color: colorMap[rank]
        //     }

        // })
        console.log({sortedRoundsWithColor})
        

        setFastestRound(fastestLap);
        setRounds(sortedRoundsWithColor);
        
        addRound({sessionId, round: currentRound});
        setCurrentRound({roundNum: currentRound.roundNum + 1, duration: 0, updateTime: 0});

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
        setFastestRound({roundNum: 1, duration: 0, updateTime: 0});
        setCurrentRound({roundNum: 1, duration: 0, updateTime: 0});
        reset(new Date(), false);
    }

    const handleStartPause = async () => {
        if(sessionId && isRunning) {
            pause();
        } else if(sessionId && !isRunning) {
            start();
        } else {
            start();
            const session = await startSession({workoutId:'test'})
            setSessionId(session.sessionId);
        }
    }

    const handleEndSession = async () => {
        pause();
        await endSession({sessionId, currentRound});
    }

    useEffect(() => {
        
        if(isRunning && new Date().getTime()  > currentRound.updateTime + 100) {
                const totalTime = rounds.reduce((prev, current) => prev + current.duration, 0);
                if(totalTime > (60 * 60 * 24)) {
                    console.log("Session is over 24 hours, ending session");
                    pause();
                }

                setCurrentRound({
                    ...currentRound,
                    duration: (hours * 60) + seconds + (minutes * 60) - totalTime,
                    updateTime: new Date().getTime(),
                })

            }
            
}, [isRunning, seconds, rounds, minutes, currentRound, hours, pause])
  return (
    <div className='timer'>
        <div className='buttons'>
            <button onClick={handleStartPause}  className={`controlButton ${isRunning ? 'pauseButton' : 'startButton'} `}>{isRunning ? 'Pause' : 'Start'}</button>
            <button onClick={handleEndSession} className="controlButton endButton">End</button>
            <button onClick={handleReset} className="controlButton resetButton">Reset</button>
        </div>
        <h3>Total: {convertTimeToString(seconds + (minutes * 60))}</h3>
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

