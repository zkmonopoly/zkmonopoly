import { Routes, Route } from "react-router";
import HomeLayout from "@/layouts/home-layout";
import Home from "@/pages/home";

export default function App() {
    return (
        <Routes>
            <Route element={<HomeLayout/>}>
                <Route path="/" element={<Home />} />
            </Route>
        </Routes>
    )
}