import { ChevronDown } from "lucide-react";

type Option = { label: string; value: string };

type Props = {
    label: string;
    options: Option[];
    onSelect: (value: string) => void;
    active: string;
    prefix?: string;
    open: boolean;
    toggle: () => void;
};

export default function FilterDropdown({
                                           label,
                                           options,
                                           onSelect,
                                           active,
                                           prefix = "",
                                           open,
                                           toggle,
                                       }: Props) {
    return (
        <div className="relative">
            <button
                onClick={toggle}
                className={`${
                    active.startsWith(prefix) && active !== `${prefix}all`
                        ? "bg-indigo-100"
                        : "bg-gray-100"
                } hover:bg-gray-200 rounded-full px-3 py-1.5 text-sm flex items-center shadow-sm`}
            >
                {label}
                <ChevronDown className="ml-1 w-4 h-4" />
            </button>
            {open && (
                <div className="absolute z-10 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 w-40">
                    {options.map(({ label, value }) => (
                        <button
                            key={value}
                            onClick={() => onSelect(value)}
                            className="w-full text-left px-4 py-2 hover:bg-indigo-50 text-sm"
                        >
                            {label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
