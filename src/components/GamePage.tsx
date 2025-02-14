import { useGameContext } from "@/context/GameContext";
import { Game, Player } from "@/types";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "./ui/button";
import { ChevronLeft, UserRoundPlus, RotateCcw, VolumeX, Volume2, PenLine } from "lucide-react"
import { Input } from "./ui/input";
import { useNavigate } from "react-router-dom";
import { PlayerSetting } from "./PlayerSetting";
import { PlayerRow } from "./PlayerRow";
import { useScreenOrientation } from "@/hook/useScreenOrientation";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";


export const GamePage = () => {
    const navigate = useNavigate();

    const { games, players: allPlayers, saveGame } = useGameContext();
    const { isVertical } = useScreenOrientation();

    const [currentGame, setCurrentGame] = useState<Game>({
        name: '',
    } as Game);
    const [players, setPlayers] = useState<Player[]>([]);
    const [isShowPlayerSetting, setisShowPlayerSetting] = useState(false);
    const [edittingPlayer, setEdittingPlayer] = useState<Player | null>(null);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const [isConfirmingReset, setIsConfirmingReset] = useState(false);
    const [timeOutSortPlayers, setTimeOutSortPlayers] = useState<NodeJS.Timeout | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);

    const backHome = () => {
        if (players.length) {
            saveGame(currentGame, players);
        }

        const searchParams = new URLSearchParams(window.location.search);
        if (searchParams.get('from') === 'history') {
            navigate('/history');
            return;
        }

        navigate('/');
    }

    const toggleDirection = () => {
        setCurrentGame({ ...currentGame, pointDirection: currentGame.pointDirection === "up" ? "down" : "up" });
    }

    const toggleMute = () => {
        setCurrentGame({ ...currentGame, isMuted: !currentGame.isMuted });
    }

    const addPlayer = (player: Player) => {
        setPlayers((prevPlayers: Player[]) => {
            if (edittingPlayer) {
                const updatedPlayers = prevPlayers.map((p) => {
                    if (p.id === player.id) {
                        return player;
                    }
                    return p;
                });

                setEdittingPlayer(null);
                return sortUsers(updatedPlayers);
            }

            return sortUsers([...prevPlayers, player]);
        });

        setisShowPlayerSetting(false);
    }

    const removePlayer = (playerId: string) => {
        const updatedPlayers = players.filter((player) => player.id !== playerId);
        setPlayers(updatedPlayers);
        setEdittingPlayer(null);
        setisShowPlayerSetting(false);
    }

    const updateScore = (playerId: string, score: number) => {
        setPlayers((prevPlayers) => {
            const updatedPlayers = prevPlayers.map((player) => {
                if (player.id === playerId) {
                    return { ...player, score };
                }
                return player;
            });

            return updatedPlayers;
        })

        if (timeOutSortPlayers) {
            clearTimeout(timeOutSortPlayers);
        }

        const newTimeout = setTimeout(() => {
            setPlayers((prevPlayers) => sortUsers(prevPlayers));
        }, 3000);

        setTimeOutSortPlayers(newTimeout);
    }

    const onEditPlayer = (player: Player) => {
        setEdittingPlayer(player);
        setisShowPlayerSetting(true);
    }

    const resetScore = () => {
        setPlayers((prevPlayers) => {
            return prevPlayers.map((player) => ({ ...player, score: 0 }));
        });

        setIsConfirmingReset(false);
    }

    const onChangingScore = () => {
        if (timeOutSortPlayers) {
            clearTimeout(timeOutSortPlayers);
        }
    }

    const balance = useMemo(() => {
        return players.reduce((acc, player) => acc + player.score, 0);
    }, [players]);

    const sortUsers = (players: Player[]) => {
        return [...players].sort(
            (a, b) => currentGame.pointDirection === "up" ? a.score - b.score : b.score - a.score
        );
    };

    useEffect(() => {
        setPlayers(sortUsers(players));
    }, [currentGame.pointDirection]);

    useEffect(() => {
        const checkOverflow = () => {
            const element = containerRef.current;
            if (element) {
                setIsOverflowing(element.scrollHeight > element.clientHeight);
            }
        };

        checkOverflow();
        window.addEventListener('resize', checkOverflow);

        return () => window.removeEventListener('resize', checkOverflow);
    }, [players]);


    useEffect(() => {
        const gameId = window.location.pathname.split("/")[2];
        const existingGame = games.find((game) => game.id === gameId);
        if (existingGame) {
            setCurrentGame(existingGame);
            const gamePlayers = allPlayers.filter((player) => player.gameId === gameId);
            setPlayers(gamePlayers);
            return
        }

        const newGame: Game = {
            id: gameId,
            name: `New game ${games.length + 1}`,
            createdAt: new Date().toISOString(),
            pointDirection: "up",
            isMuted: false,
            isEnded: false,
        }

        setCurrentGame(newGame);
    }, [games, allPlayers]);

    return (
        <div className="w-full flex flex-col h-full items-center relative">
            <div className="w-full flex items-center justify-between gap-2 p-1">
                <Button onClick={backHome} variant="secondary" className="h-fit w-26">
                    <ChevronLeft className="!w-6 !h-6" />
                </Button>
                <div className="flex gap-1 w-full max-w-1/2 items-center justify-end">
                    <Input className="border-0 w-full font-semibold text-right" placeholder="Game name..."
                        value={currentGame.name}
                        onChange={(e) => setCurrentGame({ ...currentGame, name: e.target.value })}
                    />
                    <PenLine className="!w-5 !h-5" />
                </div>
            </div>

            <div className={
                cn("w-full grow overflow-hidden flex gap-1 p-1",
                    isVertical ? "flex-col" : "flex-row"
                )
            }>
                <div className={
                    cn("grid gap-1",
                        isVertical ? "h-fit grid-cols-2 w-full" : "h-full w-22 grid-rows-2"
                    )}>
                    <motion.button whileTap={{ scale: 0.95 }} >
                        <div onClick={() => setisShowPlayerSetting(true)} className="text-black bg-primary flex items-center justify-center w-full h-full py-2">
                            <UserRoundPlus className="!w-8 !h-8" />
                        </div>
                    </motion.button>

                    <motion.button whileTap={{ scale: 0.95 }} >
                        <div onClick={() => setIsConfirmingReset(true)} className="text-black w-full h-full flex items-center justify-center bg-primary py-2">
                            <RotateCcw className="!w-8 !h-8" />
                        </div>
                    </motion.button>
                </div>

                <div
                    ref={containerRef}
                    className={`flex flex-col grow overflow-y-auto overflow-x-hidden gap-1 ${!isOverflowing ? 'justify-center' : ''}`}
                >
                    <AnimatePresence initial={false}>
                        {players.map((player) => (
                            <motion.div
                                key={player.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 500,
                                    damping: 30,
                                    opacity: { duration: 0.2 },
                                }}
                            >
                                <PlayerRow balance={balance} player={player} updateScore={updateScore} onChangingScore={onChangingScore} onEditPlayer={() => onEditPlayer(player)} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                <div className={
                    cn("grid gap-1",
                        isVertical ? "h-fit grid-cols-2 w-full" : "h-full w-22 grid-rows-2"
                    )}>
                    <motion.button whileTap={{ scale: 0.95 }} >
                        <div onClick={toggleDirection} className="text-black font-semibold bg-primary flex items-center justify-center w-full h-full text-2xl py-2">
                            {
                                currentGame.pointDirection === "up" ? '123' : '321'
                            }
                        </div>
                    </motion.button>

                    <motion.button whileTap={{ scale: 0.95 }} >
                        <div onClick={toggleMute} className="w-full text-black bg-primary h-full flex items-center justify-center py-2">
                            {
                                currentGame.isMuted ? <VolumeX className="!w-8 !h-8" /> : <Volume2 className="!w-8 !h-8" />
                            }
                        </div>
                    </motion.button>
                </div>
            </div>

            {
                isShowPlayerSetting &&
                <PlayerSetting gameId={currentGame.id} player={edittingPlayer} isShowPlayerSetting={isShowPlayerSetting} submit={addPlayer} cancel={() => setisShowPlayerSetting(false)} remove={removePlayer} />
            }

            {
                isConfirmingReset &&
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col gap-4 items-center justify-center">
                    <h2 className="text-2xl font-semibold uppercase">Are you sure to reset?</h2>
                    <div className="flex gap-2">
                        <Button className="w-32" onClick={resetScore} variant="destructive">Yes</Button>
                        <Button className="w-32" onClick={() => setIsConfirmingReset(false)}>No</Button>
                    </div>
                </div>
            }
        </div>
    );
}
