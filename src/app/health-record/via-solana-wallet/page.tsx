'use client';

import { useState } from 'react';
import { ArrowLeft, Copy, Home, User, ClipboardList, Headphones } from 'lucide-react';

const dummyRecords = [
    'General Check-Up',
    'Blood Test',
    'Cardiology Exam',
    'X-Ray Results',
    'Vaccination History',
];

export default function ViaSolanaWallet() {
    const [accessDuration, setAccessDuration] = useState('12 hours');
    const [permissionLevel, setPermissionLevel] = useState('View Only');

    return (
        <div className="min-h-screen flex flex-col justify-between bg-white text-[#3E3E60]">
            <div className="p-4">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                    <ArrowLeft className="w-5 h-5" />
                    <h1 className="text-xl font-bold text-[#4C3EFF]">Share Access Permission</h1>
                </div>

                {/* Share Type Tabs */}
                <div className="flex justify-between gap-2 mb-5">
                    <button className="flex-1 py-2 rounded-full bg-[#F1F1FF] text-[#4C3EFF] font-medium text-sm">
                        Temporary Link
                    </button>
                    <button className="flex-1 py-2 rounded-full bg-[#4C3EFF] text-white font-medium text-sm shadow">
                        Via Solana Wallet
                    </button>
                    <button className="flex-1 py-2 rounded-full bg-[#F1F1FF] text-[#4C3EFF] font-medium text-sm">
                        Anonymous
                    </button>
                </div>

                {/* Selected Records */}
                <div className="border border-[#E0E0F0] rounded-xl p-4 mb-6">
                    <h2 className="text-sm font-semibold mb-3">Selected Records ({dummyRecords.length})</h2>
                    <div className="flex flex-wrap gap-2">
                        {dummyRecords.map((record, idx) => (
                            <div
                                key={idx}
                                className="bg-[#F1F1FF] text-[#3E3E60] text-xs px-3 py-1 rounded-full flex items-center gap-1"
                            >
                                {record} <span className="text-[#888]">×</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sharing Settings */}
                <div>
                    <h2 className="text-base font-semibold mb-4">Sharing Settings</h2>

                    <label className="block text-sm mb-1">Recipient Wallet Address</label>
                    <input
                        type="text"
                        readOnly
                        value="8zJt4p2Ux3n6ZQz5YFKy..."
                        className="w-full p-2 mb-4 border border-gray-300 rounded-lg bg-[#F7F7FC] text-sm"
                    />

                    <label className="block text-sm mb-1">Access Duration</label>
                    <select
                        value={accessDuration}
                        onChange={(e) => setAccessDuration(e.target.value)}
                        className="w-full p-2 mb-4 border border-gray-300 rounded-lg bg-white text-sm"
                    >
                        <option>12 hours</option>
                        <option>24 hours</option>
                        <option>7 days</option>
                    </select>

                    <label className="block text-sm mb-1">Permission Level</label>
                    <select
                        value={permissionLevel}
                        onChange={(e) => setPermissionLevel(e.target.value)}
                        className="w-full p-2 mb-4 border border-gray-300 rounded-lg bg-white text-sm"
                    >
                        <option>View Only</option>
                        <option>Edit</option>
                        <option>Download</option>
                    </select>

                    <label className="block text-sm mb-1">Transaction ID</label>
                    <div className="relative mb-4">
                        <input
                            type="text"
                            readOnly
                            value="4zpf7h2stn5VnRyxkTxDC9..."
                            className="w-full p-2 border border-gray-300 rounded-lg bg-[#F7F7FC] text-sm pr-10"
                        />
                        <Copy className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 cursor-pointer" />
                    </div>

                    <div className="bg-[#D6F5D6] text-green-700 text-sm font-medium py-2 text-center rounded-lg mb-6">
                        Connected to Solana Network
                    </div>

                    <button className="w-full py-3 bg-[#4C3EFF] text-white rounded-full font-semibold text-lg shadow">
                        Create Share Link
                    </button>
                </div>
            </div>

            {/* Bottom Tab Navigation */}
            <div className="bg-[#4C3EFF] rounded-t-2xl py-3 px-6 flex justify-between text-white">
                <Home className="w-6 h-6" />
                <Headphones className="w-6 h-6" />
                <User className="w-6 h-6" />
                <ClipboardList className="w-6 h-6" />
            </div>
        </div>
    );
}
