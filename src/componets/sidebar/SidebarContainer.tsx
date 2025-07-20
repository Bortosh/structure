import { NavLink, useNavigate } from "react-router-dom";
import { Home, Map, People, Logout } from "@mui/icons-material";
import { useAuthStore } from "../../globalState/authStore";

export default function SidebarContainer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const user = useAuthStore((state) => state.currentUser);
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div
            className={`fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 z-40 transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"
                } md:translate-x-0 flex flex-col justify-between`}
        >
            <div>
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-700">Menu</h2>
                    <button className="md:hidden text-gray-600" onClick={onClose}>✕</button>
                </div>

                <nav className="flex flex-col">
                    {user?.idRol === 1 && (
                        <NavLink to="/" className={({ isActive }) =>
                            `flex items-center gap-4 p-4 hover:bg-gray-100 transition-colors ${isActive ? "bg-gray-100 font-semibold" : ""}`
                        } onClick={onClose}>
                            <Home />
                            <span className="text-sm">Dashboard</span>
                        </NavLink>
                    )}

                    {user?.idRol === 2 && (
                        <NavLink to="/projects" className={({ isActive }) =>
                            `flex items-center gap-4 p-4 hover:bg-gray-100 transition-colors ${isActive ? "bg-gray-100 font-semibold" : ""}`
                        } onClick={onClose}>
                            <Map />
                            <span className="text-sm">Projects</span>
                        </NavLink>
                    )}

                    <NavLink to="/supervisors" className={({ isActive }) =>
                        `flex items-center gap-4 p-4 hover:bg-gray-100 transition-colors ${isActive ? "bg-gray-100 font-semibold" : ""}`
                    } onClick={onClose}>
                        <People />
                        <span className="text-sm">Supervisors</span>
                    </NavLink>
                </nav>
            </div>

            <div className="p-4 pb-20 border-t border-gray-200">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 text-sm text-red-600 hover:text-red-700 transition-colors"
                >
                    <Logout fontSize="small" />
                    Logout
                </button>
            </div>
        </div>
    );
}
