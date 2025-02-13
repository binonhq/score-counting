import { BrowserRouter, Route, Routes } from "react-router-dom";
import { NotFoundPage } from "./components/404";
import { HomePage } from "./components/HomePage";
import { GamePage } from "./components/GamePage";
import { HistoryPage } from "./components/HistoryPage";
import { MainLayout } from "./layouts/MainLayout";
import { GameProvider } from "./context/GameContextProvider";

function App() {
    return (
        <>
            <GameProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<MainLayout />}>
                            <Route index element={<HomePage />} />
                            <Route path="/" element={<HomePage />} />
                            <Route path="/game/:id" element={<GamePage />} />
                            <Route path="/history" element={<HistoryPage />} />
                            <Route path="*" element={<NotFoundPage />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </GameProvider>
        </>
    )
}

export default App
