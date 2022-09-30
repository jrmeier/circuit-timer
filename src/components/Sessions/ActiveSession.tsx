import React, { useEffect, useState } from 'react'
import { getSession } from '../../db'
import './ActiveSession.css'
import { formatMSToDisplay } from '../../formatMSToDisplay'
import { Round } from '../Workouts/WorkoutTypes'
import { Session } from './SessionsTypes'

export function createRoundLi (round: Round) {
  return (
    <li className='rounds-li' key={round.roundNum}>
        <div >
        <span>{round.roundNum} - </span>
        <span>{formatMSToDisplay(round.duration)}</span>
        </div>
    </li>
  )
}

export function ActiveSession({ sessionId }: { sessionId: number }) {
    const [session, setSession] = useState<Session>()
    const [avgRoundTime, setAvgRoundTime] = useState<number>(0)


    useEffect(() => {
        if(sessionId) {
            // fetch session data
            getSession(sessionId).then(session => {
                setSession(session)
            })
        }

        if(session?.rounds){
            const avgRoundTime = (session.rounds.reduce((acc: number, round: Round) => acc + round.duration, 0) / session.rounds.length)
            setAvgRoundTime(avgRoundTime)
        }
    }, [sessionId, session])

    return (
        <div className='active-session-container'>
            {session && (
                <div>
                    <h2>{new Date(session.startTime).toISOString()}</h2>
            <ul>
                <li className='active-session-li'>Start: {session.startTime.toISOString()}</li>
                <li className='active-session-li'>End: {session.endTime?.toISOString()}</li>
                <li className='active-session-li'>Duration: {formatMSToDisplay(session.duration)}</li>
                <li className='active-session-li'>Avg Round: {formatMSToDisplay(avgRoundTime)}</li>
                <li className='active-session-li'>Rounds: {session.rounds.length}</li>
                <ul>{
                    session.rounds.map((round: Round) => createRoundLi(round))
                }
                </ul>

                </ul>
                </div>
            )
                }


        </div>
    )
}