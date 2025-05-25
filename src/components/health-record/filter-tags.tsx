type FilterTagsProps = {
    filters: {
        date?: string;
        type?: string;
        status?: string;
    };
    clearFilter: (key?: keyof FilterTagsProps["filters"]) => void;
};


export default function FilterTags({ filters, clearFilter }: FilterTagsProps) {
    const activeFilters = Object.entries(filters).filter(([_, value]) => !!value);

    if (activeFilters.length === 0) return null;

    const getLabel = (key: string, value: string) => {
        switch (key) {
            case "date":
                return `Date: ${value}`;
            case "type":
                return `Type: ${value}`;
            case "status":
                return `Status: ${value}`;
            default:
                return `${key}: ${value}`;
        }
    };

    return (
        <div className="mb-4 flex flex-wrap gap-2">
            {activeFilters.map(([key, value]) => (
                <div key={key} className="inline-flex items-center bg-indigo-50 rounded-full px-4 py-2 text-sm">
                    <span className="text-indigo-800 font-medium">
                        {getLabel(key, value)}
                    </span>
                    <button
                        onClick={() => clearFilter(key as keyof FilterTagsProps["filters"])}
                        className="ml-2 text-indigo-600 hover:text-indigo-800 transition-colors"
                        aria-label={`Clear ${key}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            ))}

            {/* Clear all button */}
            <button
                onClick={() => clearFilter()}
                className="inline-flex items-center bg-red-50 text-red-700 hover:bg-red-100 px-4 py-2 rounded-full text-sm font-medium transition-colors"
            >
                Clear All
            </button>
        </div>
    );
}
