export type Game = {
    id: string
    name: string
    createdAt: string
    pointDirection: 'up' | 'down'
    isMuted: boolean
    isEnded: boolean
}

export type Player = {
    id: string
    name: string
    color: string
    gameId: string
    score: number
}
