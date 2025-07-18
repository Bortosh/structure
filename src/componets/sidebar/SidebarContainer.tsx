import { useState } from "react";
import { NavLink } from "react-router-dom";
import { ChevronLeft, ChevronRight, Home, Map, People } from "@mui/icons-material";

const menuItems = [
    { text: "Inicio", icon: <Home />, path: "/" },
    { text: "Proyectos", icon: <Map />, path: "/proyectos" },
    { text: "Supervisores", icon: <People />, path: "/supervisores" },
];

export default function SidebarContainer() {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div
            className={`bg-white border-r border-gray-200 transition-all duration-300 ${isCollapsed ? "w-20" : "w-64"
                } flex flex-col`}
        >
            <div className="flex justify-end p-2 border-b border-gray-200">
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-1 rounded hover:bg-gray-100"
                >
                    {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
                </button>
            </div>

            <nav className="flex flex-col flex-1">
                {menuItems.map(({ text, icon, path }) => (
                    <NavLink
                        key={text}
                        to={path}
                        className={({ isActive }) =>
                            `flex items-center gap-4 p-4 hover:bg-gray-100 transition-colors ${isActive ? "bg-gray-100 font-semibold" : ""
                            }`
                        }
                    >
                        {icon}
                        {!isCollapsed && <span className="text-sm">{text}</span>}
                    </NavLink>
                ))}
            </nav>
        </div>
    );
}
