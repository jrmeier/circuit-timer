import React, { useEffect, useState } from 'react'
import { getSessions, Session } from '../../db'
import './Sessions.css'



export function Sessions () {
    const [ sessions, setSessions ] = useState([] as Session[])

    useEffect(() => {
        
        getSessions().then((sessions) => {
            const sortedSessions = sessions.sort((a, b) => a.sessionId - b.sessionId)
            setSessions(sortedSessions)
        })
    })


    return (
        <div>
            <h1 className='log-title'>Sessions</h1>
            <ul>{
                sessions.map((session) => {
                    return (
                        <li key={session.sessionId}
                            className='session-item'
                         >
                            {new Date(session.startTime).toLocaleString()} - {session.duration}
                        </li>
                    )
                })
            }

            </ul>
        </div>
    )
}