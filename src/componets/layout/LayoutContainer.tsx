import { useState } from "react";
import { Outlet } from "react-router-dom";
import HeaderContainer from "../header/HeaderContainer";
import SidebarContainer from "../sidebar/SidebarContainer";

const LayoutContainer = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex">
            <SidebarContainer isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="flex flex-col flex-1 h-screen overflow-hidden md:pl-64">
                <HeaderContainer onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                <main className="flex-1 overflow-auto p-4 bg-gray-50">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default LayoutContainer;
