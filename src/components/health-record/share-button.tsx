    type Props = {
        count: number;
    };

    export default function ShareButton({ count }: { count: number }) {
        return (
            <button
                disabled={count === 0}
                className={`${
                    count > 0 ? "bg-indigo-600" : "bg-gray-400"
                } text-white py-3 rounded-full font-bold text-lg shadow-md transition-colors flex-1`}
            >
                {count > 0 ? `Share ${count} Record${count > 1 ? "s" : ""}` : "Select Records to Share"}
            </button>
        );
    }

