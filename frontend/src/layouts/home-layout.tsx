import { Outlet } from "react-router";
import { twMerge } from "tailwind-merge";
import { Branding } from "@/components/branding";

interface HomeLayoutProps {
    className?: string;
}

export default function HomeLayout(props: HomeLayoutProps) {
    return (
        <div className={twMerge("min-h-screen flex flex-col antialiased", props.className)}>
            <div className="my-auto">
                <div className="flex flex-col items-center gap-y-4 rounde-md">
                    <Branding />
                    <Outlet />
                </div>
            </div>
        </div>
    );
}