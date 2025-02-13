import { useGameContext } from "@/context/GameContext";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Trash2 } from "lucide-react";
import { dateFormat } from "@/lib/utils";
import { useMemo } from "react";

export const HistoryPage = () => {
  const navigate = useNavigate();
  const { games, removeGame } = useGameContext();

  const backHome = () => {
    navigate('/');
  }

  const goToGame = (gameId: string) => {
    navigate(`/game/${gameId}?from=history`);
  }

  const listGames = useMemo(() => {
    return games.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [games]);

  return (
    <>
      <div className="flex justify-between items-center w-full gap-2">
        <Button onClick={backHome} variant="secondary" className="h-fit w-26">
          <ChevronLeft />
        </Button>
        <h1 className="text-2xl font-bold uppercase">History</h1>
      </div>
      <div className="text-black space-y-2 mt-2 overflow-y-auto h-full">
        {
          listGames.map((game) => (
            <div className="flex gap-2 items-center">
              <div onClick={() => goToGame(game.id)} key={game.id} className="grow bg-primary px-4 p-2 flex justify-between items-center">
                <h2>{game.name}</h2>
                <p>{dateFormat(new Date(game.createdAt))}</p>
              </div>
              <Button onClick={() => removeGame(game.id)} variant="secondary" className="h-full">
                <Trash2 className="!w-6 !h-6" />
              </Button>
            </div>
          ))
        }
      </div>
    </>
  );
}
