import React, { createContext, useEffect, useState } from 'react'
import { startSession, addRound, endSession as endSessionDb, Round } from '../../db';

export interface TimerContextInterface {
    start: Function,
    stop: Function,
    pause: Function,
    reset: Function,
    isRunning: boolean,
    duration: number // in ms
    startPause: Function,
    nextRound: Function,
    currentRound: TimerRound,
    endSession: Function
    rounds: TimerRound[]
}

export interface TimerRound extends Round {
    updateTime: number
    rank: number
}
export const DefaultTimerRound: TimerRound = {
    roundNum: 1,
    duration: 0,
    updateTime: 0,
    rank: 0
}

export const DefaultTimerContextProps: TimerContextInterface = {
    duration: 0,
    isRunning: false,
    start: () => console.log("start"),
    stop: () => console.log("stop"),
    pause: () => console.log("pause"),
    reset: () => console.log("reset"),
    startPause: () => console.log("startPause"),
    nextRound: () => console.log("nextRound"),
    currentRound: DefaultTimerRound,
    endSession: () => console.log("endSession"),
    rounds: []
}

export const TimerContext = createContext<TimerContextInterface>(DefaultTimerContextProps)

export const TimerContextProvider = (props: any) => {
    const [ isRunning, setIsRunning] = useState<boolean>(false)
    const [ duration, setDuration] = useState<number>(0)
    const [ intervalId, setIntervalId] = useState<any>(0)
    const [ startTime, setStartTime] = useState<number>(0)
    const [ rounds, setRounds ] = useState<TimerRound[]>([]);
    const [ sessionId, setSessionId ] = useState<number>(0);
    const [ currentRound, setCurrentRound ] = useState<TimerRound>(DefaultTimerRound);

    
    const start = () => {
        setIsRunning(true)
        setStartTime(new Date().getTime())
        setCurrentRound({...currentRound, updateTime: new Date().getTime()})
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
        setRounds([]);
        setCurrentRound(DefaultTimerRound);
    }

    const startPause = async () => {
        if(sessionId && !isRunning) {
            start()
            setStartTime(new Date().getTime())
        } else if(sessionId && isRunning) {
            pause()
        } else {
            start()
            const session = await startSession({workoutId:'test'})
            setSessionId(session.sessionId)
        }
    }

    const endSession = async () => {
        pause();
        console.log({sessionId, rounds})
        await endSessionDb({sessionId, currentRound});
    }
    const nextRound = async () => {
            const newDuration = (new Date().getTime() - (currentRound.updateTime || startTime)) + currentRound.duration
            const newRounds = [...rounds, {...currentRound, duration: newDuration }]


            setRounds(newRounds);
            addRound({sessionId, round: currentRound});
            setStartTime(new Date().getTime())
            
            setCurrentRound({...DefaultTimerRound, roundNum: currentRound.roundNum + 1, duration: 0, updateTime: new Date().getTime()});
    }
    
    useEffect(() => {
        const interval = setInterval(() => {
            if(isRunning) {
                const newDuration = new Date().getTime() - startTime + duration
                setDuration(newDuration)
                const currRoundDuraction = (new Date().getTime() - currentRound.updateTime) + currentRound.duration
                setCurrentRound({...currentRound, duration: currRoundDuraction, updateTime: new Date().getTime()})
                setStartTime(new Date().getTime())
            }
        }, 100);
        setIntervalId(interval)
        

        const newRounds = rounds.map(r => {
            const rankIndex = [...rounds].sort((a, b) => a.duration - b.duration).findIndex(xr => r.roundNum === xr.roundNum)
            return {
                ...r,
                rank: Math.abs(Math.floor((rankIndex / (rounds.length || 1)) * 10))
            }
        })

        setRounds(newRounds)
        
        return () => clearInterval(interval);
      }, [isRunning,duration, startTime, setStartTime, currentRound, setCurrentRound,]);

    return (
        <TimerContext.Provider value={{
            start,
            stop,
            pause,
            reset,
            isRunning,
            duration,
            startPause,
            nextRound,
            currentRound,
            endSession,
            rounds
        }}>
            {props.children}
        </TimerContext.Provider>
    )
}

