import { openDB, DBSchema } from 'idb';

export interface Session{
    sessionId: number;
    startTime: Date;
    endTime?: Date;
    duration: number;
    notes: string;
    workoutId: string;
    inProgress: boolean;
    rounds: Round[];
}

export interface Round {
    roundNum: number;
    duration: number;
}

interface MyDB extends DBSchema {
    sessions:   { 
        key: number;
        value: Session;
        // indexes: { 'by-workoutId': string, 'by-sessionId': string }
    },
}

export async function createDb() {
    return await openDB<MyDB>('circuit-timer', 1, {
        upgrade(db) {
        db.createObjectStore('sessions', {
            keyPath: 'sessionId',
          });
        },
    });
}


export async function saveSession(session: Session): Promise<Session> {
    const db = await createDb();

    // check if it exists
    const existingSession = await db.get('sessions', session.sessionId);
    if (existingSession) {
        // update
        await db.put('sessions', session);
        
    } else {
        await db.add('sessions', session);
    }


    return session;
}

export async function startSession({ workoutId = 'default' }) {
    const sessionId = new Date().getTime()
    console.log("starting session", sessionId);

    const newSession: Session = {
        sessionId: sessionId,
        startTime: new Date(),
        duration: 0,
        notes: '',
        workoutId,
        inProgress: true,
        rounds: []
    }
    // await db.add('sessions', newSession);
    return await saveSession(newSession);
}


export async function addRound({ sessionId, round}: { sessionId: number, round: Round }) {
    const db = await createDb();
    const session = await db.get('sessions', sessionId);

    if (session) {
        console.log("adding round", round);
        const newRound = {
            roundNum: round.roundNum,
            duration: round.duration
        }
        session.rounds.push(newRound);
        await saveSession(session);
    } else {
        console.log("no session found");
    }
}

export async function getLastActiveSession(): Promise<Session> {
    const db = await createDb();
    const sessions = await db.getAll('sessions');
    const lastActiveSession = sessions.filter(s => (s.inProgress))

    if (lastActiveSession.length > 0) {
        return lastActiveSession[0];
    } else {
        const newSession = await startSession({});
        return newSession 
    }
}

export async function endSession({ sessionId, currentRound, }: { sessionId: number, currentRound: Round}): Promise<Session> {
    const db = await createDb();
    const session = await db.get('sessions', sessionId);

    await addRound({ sessionId, round: currentRound });

    if (session) {
        session.inProgress = false;
        session.endTime = new Date();
        session.duration = session.rounds.reduce((acc, round) => acc + round.duration, 0);

        saveSession(session);
    }
    throw new Error("No session found");
}

export async function getSessions(): Promise<Session[]> {
    const db = await createDb();
    const sessions = await db.getAll('sessions');
    return sessions;
}