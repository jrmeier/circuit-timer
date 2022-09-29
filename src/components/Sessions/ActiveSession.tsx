import React, { useEffect, useState } from 'react'
import { getSession, Session } from '../../db'
import './ActiveSession.css'

export function ActiveSession({ sessionId }: { sessionId: number }) {
    const [session, setSession] = useState<Session>()
    // const [avgRoundTime, setAvgRoundTime] = useState<number>(0)

    useEffect(() => {
        if(sessionId) {
            // fetch session data
            getSession(sessionId).then(session => {
                setSession(session)
            })
        }
    }, [sessionId])

    return (
        <div className='active-session-container'>
            <h1>Active Session</h1>
            {session && <ul>
                <li className='active-session-li'>Start: {session.startTime.toISOString()}</li>
                <li className='active-session-li'>End: {session.endTime?.toISOString()}</li>
                <li className='active-session-li'>Rounds: {session.rounds.length}</li>

                </ul>
                }


        </div>
    )
}