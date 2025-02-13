import { DefaultColors } from "@/constants";
import { Input } from "./ui/input";
import { Check, X, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Player } from "@/types";
import { uuid } from "@/lib/utils";

interface PlayerSettingProps {
    isShowPlayerSetting: boolean;
    player: Player | null;
    gameId: string;
    submit: (player: Player) => void;
    remove: (playerId: string) => void;
    cancel: () => void;
}
export const PlayerSetting = (props: PlayerSettingProps) => {
    const [selectedColor, setSelectedColor] = useState(props.player?.color ||
        DefaultColors[Math.floor(Math.random() * DefaultColors.length)].value
    );
    const [playerName, setPlayerName] = useState(props.player?.name || '');

    const onSubmit = () => {
        if (props.player) {
            const updatedPlayer = { ...props.player, color: selectedColor, name: playerName };
            props.submit(updatedPlayer);
            return;
        }

        const newPlayer: Player = {
            id: uuid(),
            name: playerName,
            color: selectedColor,
            score: 0,
            gameId: props.gameId
        }
        props.submit(newPlayer);
    }

    const onCancel = () => {
        setPlayerName('');
        setSelectedColor(DefaultColors[0].value);
        props.cancel();
    }

    return (
        <div className={'absolute w-full p-1 h-full flex flex-col items-center justify-center gap-2 bg-black' + (props.isShowPlayerSetting ? '' : ' hidden')}>
            <div className="grid grid-cols-5 gap-1 w-full">
                {
                    DefaultColors.map((color, index) =>
                    (
                        <div onClick={() => setSelectedColor(color.value)} key={index} className="w-full h-20 flex items-center justify-center" style={{ backgroundColor: color.value }}>
                            {selectedColor === color.value && (
                                <Check className="text-black !w-10 !h-10" />
                            )}
                        </div>
                    ))
                }
            </div>
            <Input
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Player name..."
                className="w-full min-h-fit text-center uppercase font-bold !text-4xl !border-none !ring-0"
            />
            <div className="grid grid-cols-2 gap-4 w-full">
                {
                    props.player ? (
                        <Button onClick={() => props.player && props.remove(props.player.id)} variant="destructive" className="w-full h-fit">
                            <Trash2 className="text-black !w-10 !h-10" />
                        </Button>
                    )
                        :
                        (
                            <Button onClick={onCancel} variant="destructive" className="w-full h-fit">
                                <X className="text-black !w-10 !h-10" />
                            </Button>
                        )
                }

                <Button onClick={onSubmit} disabled={!playerName} variant="secondary" className="w-full h-fit bg-gray-300">
                    <Check className="text-black !w-10 !h-10" />
                </Button>
            </div>
        </div>
    );
}