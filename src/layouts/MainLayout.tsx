import { useScreenOrientation } from "@/hook/useScreenOrientation";
import { cn } from "@/lib/utils";
import { Outlet } from "react-router-dom";

export const MainLayout = () => {
    const { isVertical } = useScreenOrientation();
    return (
        <div className={
            cn(
                "bg-black text-white h-screen flex flex-col items-center justify-center p-4",
                {
                    "px-20": !isVertical,
                }
            )
        }>
            <div className="grow overflow-hidden w-full">
                <Outlet />
            </div>
        </div>
    );
}