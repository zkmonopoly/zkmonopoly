import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router";
import HomeLayout from "@/layouts/home-layout";
import BasicLayout from "./layouts/basic-layout";
import Home from "@/pages/home";
import Error from "@/pages/error";
import GameLayout from "./layouts/game-layout";
import { GameProvider } from "@/contexts/game-context";
import { ProgressCircle } from "./components/ui/progress-circle";
const Game = lazy(() => import("@/pages/game"));

export default function App() {
    return (
        <GameProvider>
            <Routes>
                <Route element={<HomeLayout />}>
                    <Route path="/" element={<Home />} />
                </Route>
                <Route element={<GameLayout />}>
                    <Route
                        path="game/:id"
                        element={
                            <Suspense fallback={<ProgressCircle />}>
                                <Game />
                            </Suspense>
                        }
                    />
                </Route>
                <Route element={<BasicLayout />}>
                    <Route
                        path="*"
                        element={<Error code={404} message="Page not found" />}
                    />
                </Route>
            </Routes>
        </GameProvider>
    );
}
