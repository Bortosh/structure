
const HeaderContainer = () => {
    return (
        <header className="w-full bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <button className="p-2 rounded-md hover:bg-gray-100">
                    <span className="material-icons">menu</span>
                </button>
                <h1 className="text-lg font-semibold">Panel de Control</h1>
            </div>

            <div className="flex items-center gap-4">
                {/* Aquí puedes poner avatar o nombre del usuario */}
                <span className="text-sm text-gray-600">Rogelio Ramirez Carmona</span>
            </div>
        </header>
    );
};

export default HeaderContainer;
