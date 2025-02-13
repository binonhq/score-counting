import { useScreenOrientation } from "@/hook/useScreenOrientation";
import { cn } from "@/lib/utils";
import { Player } from "@/types";
import { PlusIcon, MinusIcon, SheetIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";

interface PlayerProps {
    player: Player;
    balance: number;
    updateScore: (playerId: string, score: number) => void;
    onEditPlayer: () => void;
}

export const PlayerRow = (props: PlayerProps) => {
    const { isVertical } = useScreenOrientation();

    const [isChangingScore, setIsChangingScore] = useState(false);
    const [changeAmount, setChangeAmount] = useState(0);
    const [timeOutState, setTimeOutState] = useState<NodeJS.Timeout | null>(null);

    const onChange = (amount: number) => {
        setIsChangingScore(true);
        setChangeAmount(changeAmount + amount);

        if (timeOutState) {
            clearTimeout(timeOutState);
        }

        setTimeOutState(setTimeout(() => {
            setIsChangingScore(false);
            setChangeAmount(0);
            props.updateScore(props.player.id, props.player.score + changeAmount + amount);
        }, 2000))
    }

    const makeBalance = () => {
        setIsChangingScore(true);
        setChangeAmount(-props.balance);

        if (timeOutState) {
            clearTimeout(timeOutState);
        }

        setTimeOutState(setTimeout(() => {
            setIsChangingScore(false);
            setChangeAmount(0);
            props.updateScore(props.player.id, props.player.score - props.balance);
        }, 2000))
    }

    const scoreContent = useMemo(() => {
        if (!isChangingScore) {
            return props.player.score;
        }

        if (changeAmount >= 0) {
            return `${props.player.score} + ${changeAmount} = ${props.player.score + changeAmount}`;
        }

        return `${props.player.score} - ${Math.abs(changeAmount)} = ${props.player.score + changeAmount}`;
    }, [isChangingScore, changeAmount, props.player.score]);

    return (
        <div className={
            cn(
                "flex w-full gap-1",
                isVertical ? "flex-col" : "flex-row"
            )}
        >
            <div onClick={props.onEditPlayer} style={{ backgroundColor: props.player.color }} className="flex grow items-center justify-between h-16 px-4 text-3xl truncate text-black font-bold uppercase">
                {props.player.name}
            </div>
            <div className="flex justify-end gap-1 h-16">
                <div style={{ backgroundColor: props.player.color }} className="flex items-center w-20 px-4 text-3xl text-center min-w-max justify-center text-black font-bold uppercase">
                    {scoreContent}
                </div>
                <motion.button whileTap={{ scale: 1.2 }} >
                    <div onClick={() => onChange(1)} style={{ backgroundColor: props.player.color }} className="flex items-center justify-center text-black h-full min-w-16 font-bold uppercase">
                        <PlusIcon className="hover:cursor-pointer !w-8 !h-8" />
                    </div>
                </motion.button>

                <motion.button whileTap={{ scale: 1.2 }} >
                    <div onClick={() => onChange(-1)} style={{ backgroundColor: props.player.color }} className="flex items-center justify-center h-full text-black min-w-16 font-bold uppercase">
                        <MinusIcon className="hover:cursor-pointer !w-8 !h-8" />
                    </div>
                </motion.button>

                <motion.button whileTap={{ scale: 1.2 }} >
                    <div onClick={makeBalance} style={{ backgroundColor: props.player.color }} className="flex items-center justify-center h-full text-black min-w-16 font-bold uppercase">
                        <SheetIcon className="hover:cursor-pointer !w-8 !h-8" />
                    </div>
                </motion.button>
            </div>
        </div>
    );
}