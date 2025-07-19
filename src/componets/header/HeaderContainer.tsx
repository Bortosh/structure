import { useLocation } from "react-router-dom";

function formatPathTitle(pathname: string) {
    if (pathname === "/") return "Panel de Control";

    return pathname
        .split("/")
        .filter(Boolean)
        .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
        .join(" / ");
}

export default function HeaderContainer() {
    const { pathname } = useLocation();

    return (
        <header className="w-full bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
            <h1 className="text-lg font-semibold text-gray-800">{formatPathTitle(pathname)}</h1>

            <div className="flex items-center gap-2 ml-4">
                <span className="text-sm text-gray-600">Rogelio Ramirez Carmona</span>
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    RR
                </div>
            </div>
        </header>
    );
}
