import { Button } from "@/components/ui/button"
import { uuid } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

export const HomePage = () => {
  const navigate = useNavigate();
  const startGame = () => {
    const id = uuid();
    navigate(`/game/${id}`);
  }

  const viewHistory = () => {
    navigate('/history');
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
      <h1 className="text-4xl font-semibold text-center">SCORE COUNTING</h1>
      <div className="space-y-2 flex gap-2 w-full max-w-3xl">
        <Button className="w-full text-black text-xl h-fit" onClick={startGame}>New Game</Button>
        <Button className="w-full text-black text-xl h-fit" onClick={viewHistory} variant="outline">History</Button>
      </div>
    </div>
  );
}
