import { Outlet } from "react-router-dom";

export const MainLayout = () => {
    return (
        <div className="bg-black text-white h-[100dvh] flex flex-col items-center justify-center p-4"
        >
            <div className="grow overflow-hidden w-full">
                <Outlet />
            </div>
        </div>
    );
}