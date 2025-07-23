
interface MapSearchProps {
    searchQuery: string;
    loadingSearch: boolean;
    searchResults: any[];
    onSearchChange: (query: string) => void;
    onResultClick: (place: any) => void;
    className?: string;
}

const MapSearch: React.FC<MapSearchProps> = ({
    searchQuery,
    loadingSearch,
    searchResults,
    onSearchChange,
    onResultClick,
    className = "",
}) => {
    const handleResultClick = (place: any) => {
        onResultClick(place);
        // The search query will be updated through the hook's handlePlaceSelect
    };

    return (
        <div className={`bg-white rounded-lg shadow-sm border border-gray-200 relative ${className}`}>
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search for a place..."
                className="w-full h-10 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />

            {loadingSearch && (
                <div className="absolute top-full left-0 right-0 mt-1 px-4 py-2 text-xs text-gray-500 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    Loading...
                </div>
            )}

            {searchResults.length > 0 && (
                <ul className="absolute top-full left-0 right-0 mt-1 max-h-60 overflow-auto divide-y divide-gray-100 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    {searchResults.map((place, index) => (
                        <li
                            key={index}
                            onClick={() => handleResultClick(place)}
                            className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-50"
                        >
                            <div className="font-medium">{place.displayName}</div>
                            <div className="text-xs text-gray-500 truncate">
                                {place.formattedAddress || ""}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MapSearch;
