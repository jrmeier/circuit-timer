import { useEffect, useState } from "react"
import { Session } from './SessionsTypes'
import { getSessions } from '../../db'

export const withSessions = (Component: React.ComponentType<any>) => {
    return (props: any) => {
        const [ sessions, setSessions ] = useState([] as Session[])
        const [ loaded, setLoaded ] = useState(false)

        useEffect(() => {
        if(!loaded) {
            getSessions().then((newSessions) => {
                const sortedSessions = newSessions.sort((a, b) => b.sessionId - a.sessionId)
                setSessions(sortedSessions)
            })
            setLoaded(true)
        }
        }, [sessions, loaded])

        return <Component {...props} sessions={sessions} />
    }
}