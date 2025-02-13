import { createContext, useContext } from "react";
import { Game, Player } from "@/types";

export type GameContextType = {
    games: Game[];
    players: Player[];
    saveGame: (game: Game, newPlayers: Player[]) => void;
    removeGame: (gameId: string) => void;
}

export const GameContext = createContext<GameContextType>({
    games: [],
    players: [],
    saveGame: () => { },
    removeGame: () => { },
});

export const useGameContext = () => {
    return useContext(GameContext);
};

