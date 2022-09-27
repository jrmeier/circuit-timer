import React, { createContext } from 'react'
import { 
    useTimer,
    TimerContextInterface,
    DefaultTimerContextProps,
} from './useTimer';


export const TimerContext = createContext<TimerContextInterface>(DefaultTimerContextProps)

;
export const TimerContextProvider = (props: any) => {

    const {
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
        removeRound
    } = useTimer()

    return (<TimerContext.Provider value={{
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
        removeRound
    }}>
        {props.children}
    </TimerContext.Provider>
    )
}