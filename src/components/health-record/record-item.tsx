type Record = {
    id: number;
    title: string;
    date: string;
    doctor?: string;
    lab?: string;
    type: string;
    location: string;
    status: string;
};

type Props = {
    record: Record;
    isSelected: boolean;
    onToggle: () => void;
};

export default function RecordItem({ record, isSelected, onToggle }: Props) {
    return (
        <div className="border border-gray-200 rounded-xl p-3 flex items-center shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mr-3">
                <span className="text-2xl font-bold">PDF</span>
            </div>
            <div className="flex-1">
                <h3 className="text-lg font-bold">{record.title}</h3>
                <div className="text-sm space-y-0.5">
                    <p><strong>Date:</strong> {record.date}</p>
                    {record.doctor && <p><strong>Doctor:</strong> {record.doctor}</p>}
                    {record.lab && <p><strong>Lab:</strong> {record.lab}</p>}
                    <p><strong>Type:</strong> {record.type}</p>
                    <p><strong>Location:</strong> {record.location}</p>
                </div>
                {record.status && (
                    <div className={`mt-1 px-3 py-1 rounded-full text-xs inline-block ${
                        record.status === "Shared"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                    }`}>
                        {record.status}
                    </div>
                )}
            </div>
            <div
                onClick={onToggle}
                className={`w-6 h-6 rounded-full border flex items-center justify-center cursor-pointer ${
                    isSelected ? "bg-indigo-600 border-indigo-600" : "bg-white border-gray-300"
                }`}
            >
                {isSelected && <div className="w-3 h-3 rounded-full bg-white" />}
            </div>
        </div>
    );
}
