import { Outlet } from "react-router-dom";
import HeaderContainer from "../header/HeaderContainer";
import SidebarContainer from "../sidebar/SidebarContainer";

const LayoutContainer = () => {
    return (
        <div className="flex min-h-screen">
            <SidebarContainer />
            <div className="flex flex-col flex-1 overflow-auto">
                <HeaderContainer />
                <main className="flex-1 p-4 bg-gray-50">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default LayoutContainer;
