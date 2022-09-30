export type Movement = {
    movementId: string;
    name: string;
    description: string;
    kettlebell: boolean;
    dumbbell: boolean;
    barbell: boolean;
    bodyweight: boolean;
    machine: boolean;
}
export type Round = {
    roundNum: number;
    duration: number;
    movement?: Movement;
}

export type Workout = {
    id: number
    name: string
    totalRounds: number
    set: []
}