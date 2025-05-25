import { ChevronLeft, Search, Settings } from "lucide-react";

export default function Header() {
    return (
        <div className="p-4 flex justify-between items-center">
            <ChevronLeft className="text-indigo-600 w-6 h-6" />
            <h1 className="text-indigo-600 text-xl font-semibold">Health Record</h1>
            <div className="flex space-x-2">
                <div className="bg-blue-100 rounded-full p-2">
                    <Search className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="bg-blue-100 rounded-full p-2">
                    <Settings className="w-5 h-5 text-indigo-600" />
                </div>
            </div>
        </div>
    );
}
