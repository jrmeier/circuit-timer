import React,  { useEffect, useState } from 'react';
import { useStopwatch } from 'react-timer-hook'
import './Timer.css';

type Lap = {
    lap: number;
    time: number;
    lapTime: number;
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

      const [laps, setLaps] = useState<Lap[]>([]);
      const [fastestLap, setFastestLap] = useState<Lap>({lap: 0, time: 0, lapTime: 0});
      const [lapTime, setLapTime] = useState<number>(0);


    const convertTimeToString = (seconds: number, minutes: number) => {
  
        const addLeadingZero = (num: number) => num < 10 ? `0${num}` : num;
        return addLeadingZero(minutes) + ":" + addLeadingZero(seconds)
      }

    const handleLap = () => {
        const newLaps = [
            ...laps, 
            {
                time: (60 * minutes) + seconds, 
                lap: laps.length,
                lapTime: lapTime
            }
        ];

        // if()
        const fastestLap = newLaps.reduce((prev, current) => (prev.lapTime < current.lapTime) ? prev : current);


        setFastestLap(fastestLap);
        setLaps(newLaps)
    }


    const createLapItem = (lap: Lap) => {
        // const lapTime = lap - (laps[index - 1] || 0);
        
        return `${lap.lap + 1} - ${convertTimeToString(lap.time, 0)}`
    
    }

    const handleReset = () => {
        pause();
        setLaps([]);
        setFastestLap({lap: 0, time: 0, lapTime: 0});
        setLapTime(0);
        reset();
    }


    
    useEffect(() => {
        if (isRunning && seconds) {
            // update the lap time
            if(laps.length) {
                const lapTime = (60 * minutes) + seconds - laps[laps.length - 1].time;
                setLapTime(lapTime)
            } else {
                setLapTime(seconds)
            }
        }
}, [isRunning, seconds, laps, minutes])

  return (
    <div className='timer'>
        Total Time: {convertTimeToString(seconds, minutes)}< br/>
        Lap Time: {lapTime}< br/>

        <div className='buttons'>
            <button onClick={isRunning ? pause : start}  className="controlButton">{isRunning ? 'Pause' : 'Start'}</button>
            <button onClick={handleReset} className="controlButton">Reset</button>
        </div>
        <div>
            <button onClick={handleLap} className="controlButton">LAP</button>
        </div>
        <div>
            Fastest Lap: Lap #{fastestLap.lap + 1} Time: {convertTimeToString(fastestLap.lapTime, 0)}
        </div>
        <div>
            {laps
            .map((lap, index) => {
                return <div key={index}>{createLapItem(lap)}</div>
            }).reverse()}
        </div>
    </div>
  );
}

