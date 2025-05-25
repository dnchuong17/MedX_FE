import RecordItem from "./record-item";

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
    records: Record[];
    selected: number[];
    toggleSelect: (id: number) => void;
};

export default function RecordList({ records, selected, toggleSelect }: Props) {
    if (records.length === 0) {
        return (
            <div className="text-center py-10">
                <p className="text-gray-500">No records match your filter criteria</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {records.map((r) => (
                <RecordItem
                    key={r.id}
                    record={r}
                    isSelected={selected.includes(r.id)}
                    onToggle={() => toggleSelect(r.id)}
                />
            ))}
        </div>
    );
}
