import React, { createContext, useCallback, useEffect, useState } from 'react'
import { differenceInSeconds }from 'date-fns'

export interface TimerContextInterface {
    start: Function,
    stop: Function,
    pause: Function,
    reset: Function,
    isRunning: boolean,
    duration: number
}

export const DefaultTimerContextProps: TimerContextInterface = {
    duration: 0,
    isRunning: false,
    start: () => console.log("start"),
    stop: () => console.log("stop"),
    pause: () => console.log("pause"),
    reset: () => console.log("reset"),
}

export const TimerContext = createContext<TimerContextInterface>(DefaultTimerContextProps)

export const TimerContextProvider = (props: any) => {
    
    const [ isRunning, setIsRunning] = useState<boolean>(false)
    const [ duration, setDuration] = useState<number>(0)
    const [ intervalId, setIntervalId] = useState<any>(0)
    const [ startTime, setStartTime] = useState<number>(0)

    
    const start = () => {
        setIsRunning(true)
    }
    const stop = () => setIsRunning(false)
    const pause = () => {
        setIsRunning(false)
        clearInterval(intervalId)
    }
    const reset = () => {
        setDuration(0)
        setIsRunning(false)
        clearInterval(intervalId)
    }
    
    useEffect(() => {
        const interval = setInterval(() => {
            if(isRunning) {
                const wtf = differenceInSeconds(startTime, new Date()) * 1000
                console.log(new Date(wtf))
                // const newDuration = d
                // setDuration(newDuration)
                // setStartTime()
            }
        }, 100);
        setIntervalId(interval)
        return () => clearInterval(interval);
      }, [isRunning,duration]);

    return (
        <TimerContext.Provider value={{
            start,
            stop,
            pause,
            reset,
            isRunning,
            duration
        }}>
            {props.children}
        </TimerContext.Provider>
    )
}

