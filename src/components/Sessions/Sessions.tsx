import React, { useEffect, useState } from 'react'
import { getSessions, Session } from '../../db'
import { formatMSToDisplay } from '../../formatMSToDisplay'
import './Sessions.css'
import { Link } from 'wouter'


export function Sessions () {
    const [ sessions, setSessions ] = useState([] as Session[])

    useEffect(() => {
        
        getSessions().then((sessions) => {
            const sortedSessions = sessions.sort((a, b) => b.sessionId - a.sessionId)
            setSessions(sortedSessions)
        })
    })

    return (
        <div className='sessions-container'>
            <h1 className='log-title'>Sessions</h1>
            <ul>{
                sessions.map((session,idx) => {
                    return (
                        <Link to={`/circuit-timer/sessions/${session.sessionId}`}>
                        <li key={session.sessionId}
                            className='session-item'
                         >
                            {new Date(session.startTime).toLocaleString()} - {formatMSToDisplay(session.duration)}
                        </li>
                        </Link>
                    )
                })
            }

            </ul>
        </div>
    )
}