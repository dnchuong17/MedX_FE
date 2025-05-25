"use client";

import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

type Props = {};

export default function AddButton({}: Props) {
    const router = useRouter();

    return (
        <button
            onClick={() => router.push("/add-new-record/manual-entry")}
            className="bg-indigo-600 rounded-full p-3 shadow-lg hover:bg-indigo-700 transition-colors"
        >
            <Plus className="text-white w-6 h-6" />
        </button>
    );
}
