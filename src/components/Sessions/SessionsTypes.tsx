import { Round } from '../Workouts/WorkoutTypes'

export type Session = {
    sessionId: number;
    startTime: Date;
    endTime?: Date;
    duration: number;
    notes: string;
    workoutId: string;
    inProgress: boolean;
    rounds: Round[];
}