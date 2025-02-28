import { Outlet } from "react-router";
import { twMerge } from "tailwind-merge";

interface BasicLayoutProps {
    className?: string;
}

export default function BasicLayout(props: BasicLayoutProps) {
    return (
        <div className={twMerge("min-h-screen flex flex-col antialiased", props.className)}>
            <div className="my-auto">
                <Outlet />
            </div>
        </div>
    );
}