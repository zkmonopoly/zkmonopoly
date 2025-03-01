import { Outlet } from "react-router";
import { twMerge } from "tailwind-merge";

interface HomeLayoutProps {
    className?: string;
}

export default function HomeLayout(props: HomeLayoutProps) {
    return (
        <div className={twMerge("min-h-screen flex flex-col antialiased", props.className)}>
            <div className="my-auto">
                <Outlet />
            </div>
        </div>
    )
}