import { Outlet } from "react-router";

export default function GameLayout() {
    return (
        <div className='flex flex-col min-h-screen antialiased'>
            <div className='flex flex-grow my-1'>
                <div className="w-full grid md:grid-cols-12">
                    <div className="md:col-span-3 hidden md:block">
                        {/* TODO: Add sidebar controls */}
                    </div>
                    <div className="md:col-span-9">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
}