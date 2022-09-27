export type Round = {
    roundNum: number;
    duration: number;
}

export type TimerRound = Round & {
    updateTime: number
    rank: number
}

export const DefaultTimerRound: TimerRound = {
    roundNum: 1,
    duration: 0,
    updateTime: 0,
    rank: 0
}
