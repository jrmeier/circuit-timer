import React from 'react'
import { Session } from './SessionsTypes'
import { formatMSToDisplay } from '../../formatMSToDisplay'
import './Sessions.css'
import { Link } from 'wouter'
import { withSessions } from './withSessions'


export function SessionsComponent ({ sessions }: { sessions: Session[] }) {
    return (
        <div className='sessions-container'>
            <h1 className='log-title'>Sessions</h1>
            <ul>{
                sessions.map((session,idx) => {
                    return (
                        <Link to={`/circuit-timer/sessions/${session.sessionId}`} key={idx}>
                        <li key={idx}
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
export const Sessions = withSessions(SessionsComponent)