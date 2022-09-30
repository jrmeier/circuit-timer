import { createContext, useEffect, useState } from 'react'
import { startSession, addRound, endSession as endSessionDb  } from '../../db';

import { TimerRound, DefaultTimerRound } from './TimerRoundTypes';

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
    rounds: TimerRound[],
    removeRound: Function,
    avgRoundTime: number
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
    rounds: [],
    removeRound: () => console.log("removeRound"),
    avgRoundTime: 0
}

export const TimerContext = createContext<TimerContextInterface>(DefaultTimerContextProps)

export const useTimer = () => {
    const [ isRunning, setIsRunning] = useState<boolean>(false)
    const [ duration, setDuration] = useState<number>(0)
    const [ intervalId, setIntervalId] = useState<any>(0)
    const [ startTime, setStartTime] = useState<number>(0)
    const [ rounds, setRounds ] = useState<TimerRound[]>([]);
    const [ sessionId, setSessionId ] = useState<number>(0);
    const [ currentRound, setCurrentRound ] = useState<TimerRound>(DefaultTimerRound);
    const [ avgRoundTime, setAvgRoundTime ] = useState<number>(0);
    
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
        await endSessionDb({sessionId, currentRound});
        reset();
    }
    const nextRound = async () => {
            const newDuration = (new Date().getTime() - (currentRound.updateTime || startTime)) + currentRound.duration
            const newRounds = [...rounds, {...currentRound, duration: newDuration }]


            setRounds(newRounds);
            addRound({sessionId, round: currentRound});
            setStartTime(new Date().getTime())
            
            setCurrentRound({...DefaultTimerRound, roundNum: currentRound.roundNum + 1, duration: 0, updateTime: new Date().getTime()});
    }

    const removeRound = (roundNum: number) => {
        const newRounds = rounds
        .filter((r) => r.roundNum !== roundNum)
        .sort((a, b) => a.roundNum - b.roundNum)
        .map((r, i) => ({...r, roundNum: i + 1}))
        // redo the round number

        const newDuration = newRounds.reduce((acc, r) => acc + r.duration, 0)
        setDuration(newDuration)
        const latestRoundNum = newRounds[newRounds.length - 1].roundNum

        setCurrentRound({ ...currentRound, roundNum: (latestRoundNum || 0) + 1})
        setRounds(newRounds);
    }

    const rankRounds = (rounds: TimerRound[]) => rounds.map(r => {
            const rankIndex = [...rounds].sort((a, b) => a.duration - b.duration).findIndex(xr => r.roundNum === xr.roundNum)
            return {
                ...r,
                rank: Math.abs(Math.floor((rankIndex / (rounds.length || 1)) * 10))
            }
        })
    const calcAvgRound = (rounds: TimerRound[]) => rounds.reduce((acc, r) => acc + r.duration, 0) / (rounds.length || 1)
    
    useEffect(() => {
        const interval = setInterval(() => {
            if(isRunning) {
                const newDuration = new Date().getTime() - startTime + duration
                setDuration(newDuration)
                const currRoundDuraction = (new Date().getTime() - currentRound.updateTime) + currentRound.duration
                const newCurrentRound = {...currentRound, duration: currRoundDuraction, updateTime: new Date().getTime()}
                setStartTime(new Date().getTime())
                
                const newRounds = rankRounds(rounds)

                const newCurrentRoundWithRank = rankRounds([
                    ...newRounds,
                    {...newCurrentRound}
                ])
                .filter(r => r.roundNum === newCurrentRound.roundNum).pop() || newCurrentRound
                
                setAvgRoundTime(calcAvgRound(newRounds))
                setCurrentRound(newCurrentRoundWithRank)
                setRounds(newRounds)
            }
        }, 100);
        setIntervalId(interval)
        
        
        return () => clearInterval(interval);
      }, [isRunning,duration, startTime, setStartTime, currentRound, setCurrentRound, rounds, setRounds]);

    return {
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
            rounds,
            removeRound,
            avgRoundTime
        }
}

