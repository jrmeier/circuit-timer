import React,  { useEffect, useState } from 'react';
import { useStopwatch } from 'react-timer-hook'
import './Timer.css';

type round = {
    round: number;
    roundTime: number;
    updateTime: number;
}

export function Timer() {
    const {
        seconds,
        minutes,
        // hours,
        // days,
        isRunning,
        start,
        pause,
        reset,
      } = useStopwatch({ autoStart: false });

      const [rounds, setRounds] = useState<round[]>([]);
      const [fastestRound, setFastestRound] = useState<round>({round: 1, roundTime: 0, updateTime: 0});
      const[currentRound, setCurrentRound] = useState<round>({round: 1, roundTime: 0, updateTime: 0});

    const convertTimeToString = (seconds: number) => {
        // console.log({seconds, minutes});
        let minutes = 0
        if(seconds > 60) {
            minutes = Math.floor(seconds / 60);
            seconds = seconds % 60;
        }
        // return `${minutes}:${seconds}`;
        // console.log({minutes, seconds});
  
        const addLeadingZero = (num: number) => num < 10 ? `0${num}` : num;
        return addLeadingZero(minutes) + ":" + addLeadingZero(seconds)
      }
    const handleRound = () => {
        const newRounds = [
            ...rounds, 
            {
                ...currentRound,
            }
        ];

        const fastestLap = newRounds.reduce((prev, current) => (prev.roundTime < current.roundTime) ? prev : current);


        setFastestRound(fastestLap);
        setRounds(newRounds);
        setCurrentRound({round: currentRound.round + 1, roundTime: 0, updateTime: 0});
    }

    const createRoundItem = (round: round) => `${round.round} - ${convertTimeToString(round.roundTime)}`

    const handleReset = () => {
        pause();
        setRounds([]);
        setFastestRound({round: 1, roundTime: 0, updateTime: 0});
        setCurrentRound({round: 1, roundTime: 0, updateTime: 0});
        reset(new Date(), false);
    }

    useEffect(() => {
        
        if(isRunning && new Date().getTime()  > currentRound.updateTime + 500) {
                const totalTime = rounds.reduce((prev, current) => prev + current.roundTime, 0);
                setCurrentRound({
                    ...currentRound,
                    roundTime: seconds + (minutes * 60) - totalTime,
                    updateTime: new Date().getTime(),
                })
            }

            
}, [isRunning, seconds, rounds, minutes, currentRound])
  return (
    <div className='timer'>
        <div className='buttons'>
            <button onClick={isRunning ? pause : start}  className={`controlButton ${isRunning ? 'pauseButton' : 'startButton'} `}>{isRunning ? 'Pause' : 'Start'}</button>
            <button onClick={handleReset} className="controlButton resetButton">Reset</button>
        </div>
        <h3>Total: {convertTimeToString(seconds + (minutes * 60))}</h3>
        {/* <h1>{currentRound.round} - {convertTimeToString(curr)}</h1> */}
        <h1>{convertTimeToString(currentRound.roundTime)}</h1>

        <div>
            <button onClick={handleRound} className="controlButton roundButton" disabled={!isRunning}>NEXT ROUND</button>
        </div>
        <div>
            Fastest round: round #{fastestRound.round} Time: {convertTimeToString(fastestRound.roundTime)}
        </div>
        <div>
            <ul>
            {rounds
            .map((round, index) => {
                return <li className='roundLi' key={index}>{createRoundItem(round)}</li>
            }).reverse()}
            </ul>
        </div>
    </div>
  );
}

