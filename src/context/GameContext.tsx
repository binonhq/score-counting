import { createContext, useContext, useEffect, useState } from "react";
import { Game, Player } from "../types";
import { ReactNode } from "react";

export type GameContext = {
  games: Game[];
  players: Player[];
  saveGame: (game: Game, newPlayers: Player[]) => void;
  removeGame: (gameId: string) => void;
}

const GameContext = createContext<GameContext>({
  games: [],
  players: [],
  saveGame: () => { },
  removeGame: () => { },
});

export const useGameContext = () => {
    return useContext(GameContext);
};

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [games, setGames] = useState<Game[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);

  const saveGame = (game: Game, newPlayers: Player[]) => {
    const existingGame = games.find((g) => g.id === game.id);
    if (!existingGame) {
      const updatedGames = [...games, game];
      setGames(updatedGames);
      localStorage.setItem('games', JSON.stringify(updatedGames));
    }
    
    const updatedPlayers: Player[] = [];
    players.forEach((player) => {
      const newPlayer = newPlayers.find((p) => p.id === player.id);
      if (newPlayer) {
        return
      } 
      updatedPlayers.push(player);
    });

    const storedPlayers = [...newPlayers, ...updatedPlayers];
    setPlayers(storedPlayers);
  };

  const removeGame = (gameId: string) => {
    const updatedGames = games.filter((game) => game.id !== gameId);
    setGames(updatedGames);
    localStorage.setItem('games', JSON.stringify(updatedGames));

    const updatedPlayers = players.filter((player) => player.gameId !== gameId);
    setPlayers(updatedPlayers);
    localStorage.setItem('players', JSON.stringify(updatedPlayers));
  }

  useEffect(() => {
    const storedGames = JSON.parse(localStorage.getItem('games') || '[]');
    setGames(storedGames);

    const storedPlayers = JSON.parse(localStorage.getItem('players') || '[]');
    setPlayers(storedPlayers);
  }, []);

  return (
    <GameContext.Provider value={{ games, saveGame, players, removeGame }}>
      {children}
    </GameContext.Provider>
  );
};