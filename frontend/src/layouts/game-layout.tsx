import { InteractiveConsole } from "@/components/ui/interactive-console";
import { Outlet } from "react-router";

export default function GameLayout() {
    return (
        <div className='flex flex-col min-h-screen antialiased'>
            <div className='flex flex-grow'>
                <div className="w-full grid md:grid-cols-12">
                    <div className="md:col-span-3 hidden md:block relative">
                        {/* TODO: Add sidebar controls */}
                        sss
                        <InteractiveConsole className="w-full absolute left-0 bottom-0 " />
                    </div>
                    <div className="md:col-span-9">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
}