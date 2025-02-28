import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router";
import HomeLayout from "@/layouts/home-layout";
import BasicLayout from "./layouts/basic-layout";
import Home from "@/pages/home";
import Error from "@/pages/error";
import { CircularProgress } from "./components/circular-progress";
const Game = lazy(() => import("@/pages/game"));

export default function App() {
    return (
        <Routes>
            <Route element={<HomeLayout/>}>
                <Route path="/" element={<Home />} />
            </Route>
            <Route element={<BasicLayout/>}>
                <Route path="game/:id" element={<CircularProgress/>} />
                <Route path="*" element={<Error code={404} message="Page not found" />} />
            </Route>
        </Routes>
    );
}