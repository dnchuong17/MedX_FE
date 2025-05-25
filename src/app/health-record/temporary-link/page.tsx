"use client"
import { useState } from "react";
import { X, Copy, Check, Info, ChevronDown } from "lucide-react";
import BottomNavigation from "@/components/navbar";

type RecordType = {
    id: number;
    name: string;
};

type ShareOption = {
    id: string;
    name: string;
    active: boolean;
};

export default function ShareAccess() {

    const [selectedRecords, setSelectedRecords] = useState<RecordType[]>([
        { id: 1, name: "General Check-Up" },
        { id: 2, name: "Blood Test" },
        { id: 3, name: "Cardiology Exam" },
        { id: 4, name: "X-Ray Results" },
        { id: 5, name: "Vaccination History" },
    ]);

    const [shareOptions, setShareOptions] = useState<ShareOption[]>([
        { id: "temp", name: "Temporary Link", active: false },
        { id: "wallet", name: "Via Solana Wallet", active: true },
        { id: "anon", name: "Anonymous", active: false },
    ]);

    const [accessDuration, setAccessDuration] = useState("12 hours");
    const [walletAddress, setWalletAddress] = useState("8zsh4p2Uv3nDZQzSYPKvY...");
    const [transactionId, setTransactionId] = useState("4zpf7h2anGWRykxTxDC9...");
    const [shareLink, setShareLink] = useState("healthapp.com/share/anon/68K3-f7...");
    const [accessCode, setAccessCode] = useState("68K3-f7P9-92T5");
    const [anonymousNotes, setAnonymousNotes] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showDurationDropdown, setShowDurationDropdown] = useState(false);
    const [activeRecord, setActiveRecord] = useState<RecordType | null>(null);
    const [showRecordModal, setShowRecordModal] = useState(false);
    const [copied, setCopied] = useState("");
    const [viewLimit, setViewLimit] = useState("Single View");
    const [permissionLevel, setPermissionLevel] = useState("View Only");
    const [showDropdown, setShowDropdown] = useState<string | null>(null);

    const checkupDates = [
        { date: "05/05/2025" },
        { date: "06/05/2025" },
        { date: "07/05/2025" },
    ];

    const toggleShareOption = (id: string) => {
        setShareOptions((prev) =>
            prev.map((option) => ({
                ...option,
                active: option.id === id,
            }))
        );
    };

    const simulateCopy = (text: string, type: string) => {
        setCopied(type);
        setTimeout(() => setCopied(""), 2000);
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleRecordClick = (record: RecordType) => {
        setActiveRecord(record);
        setShowRecordModal(true);
    };

    const toggleDropdown = (dropdown: string) => {
        if (showDropdown === dropdown) {
            setShowDropdown(null);
        } else {
            setShowDropdown(dropdown);
        }
    };

    const handleDropdownSelect = (dropdown: string, value: string) => {
        if (dropdown === 'duration') {
            setAccessDuration(value);
        } else if (dropdown === 'viewLimit') {
            setViewLimit(value);
        } else if (dropdown === 'permissionLevel') {
            setPermissionLevel(value);
        }
        setShowDropdown(null);
    };

    const currentShareOption = shareOptions.find(opt => opt.active)?.id || "temp";

    return (
        <div className="flex min-h-screen bg-gray-100 relative">
            <main className="flex-1 max-w-md mx-auto bg-white shadow-lg relative pb-24">
                {/* Header */}
                <div className="p-4 border-b flex items-center">
                    <button className="text-indigo-600">
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M15 18L9 12L15 6"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                    <h1 className="text-center flex-1 text-xl font-bold text-indigo-700">
                        Share Access Permission
                    </h1>
                </div>

                {/* Share Options */}
                <div className="p-4 flex gap-2 justify-center">
                    {shareOptions.map((option) => (
                        <button
                            key={option.id}
                            className={`py-2 px-4 rounded-full text-sm ${
                                option.active
                                    ? "bg-indigo-100 text-indigo-700 font-medium"
                                    : "bg-gray-100 text-gray-600"
                            }`}
                            onClick={() => toggleShareOption(option.id)}
                        >
                            {option.name}
                        </button>
                    ))}
                </div>

                {/* Selected Records */}
                <div className="p-4">
                    <h2 className="font-medium mb-2">Selected Records ({selectedRecords.length})</h2>
                    <div className="bg-indigo-50 p-4 rounded-lg flex flex-wrap gap-2">
                        {selectedRecords.map((record) => (
                            <button
                                key={record.id}
                                onClick={() => handleRecordClick(record)}
                                className="bg-white py-1 px-3 rounded-full text-xs flex items-center gap-1"
                            >
                                {record.name}
                                <span className="text-gray-400 ml-1">×</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="border-t border-gray-100 my-2"></div>

                {/* Sharing Settings */}
                <div className="p-4">
                    <h2 className="font-medium mb-4">Sharing Settings</h2>

                    {/* Via Solana Wallet Tab */}
                    {currentShareOption === "wallet" && (
                        <div className="space-y-4">
                            <div className="mb-4">
                                <label className="text-sm text-gray-500 mb-1 block">Recipient Wallet Address</label>
                                <input
                                    type="text"
                                    value={walletAddress}
                                    onChange={(e) => setWalletAddress(e.target.value)}
                                    className="w-full p-3 rounded-lg bg-gray-100"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="text-sm text-gray-500 mb-1 block">Access Duration</label>
                                <div className="relative">
                                    <button
                                        className="w-full p-3 rounded-lg bg-gray-100 text-left flex justify-between items-center"
                                        onClick={() => toggleDropdown('duration')}
                                    >
                                        {accessDuration}
                                        <ChevronDown className="w-4 h-4" />
                                    </button>
                                    {showDropdown === 'duration' && (
                                        <div className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-lg mt-1 z-10">
                                            {["6 hours", "12 hours", "24 hours", "48 hours", "1 week"].map((duration) => (
                                                <button
                                                    key={duration}
                                                    className="w-full p-3 text-left hover:bg-gray-50"
                                                    onClick={() => handleDropdownSelect('duration', duration)}
                                                >
                                                    {duration}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="text-sm text-gray-500 mb-1 block">Permission Level</label>
                                <div className="relative">
                                    <button
                                        className="w-full p-3 rounded-lg bg-gray-100 text-left flex justify-between items-center"
                                        onClick={() => toggleDropdown('permissionLevel')}
                                    >
                                        {permissionLevel}
                                        <ChevronDown className="w-4 h-4" />
                                    </button>
                                    {showDropdown === 'permissionLevel' && (
                                        <div className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-lg mt-1 z-10">
                                            {["View Only", "View & Download", "View & Comment"].map((level) => (
                                                <button
                                                    key={level}
                                                    className="w-full p-3 text-left hover:bg-gray-50"
                                                    onClick={() => handleDropdownSelect('permissionLevel', level)}
                                                >
                                                    {level}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="text-sm text-gray-500 mb-1 block">Transaction ID</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={transactionId}
                                        readOnly
                                        className="w-full p-3 rounded-lg bg-gray-100 pr-10"
                                    />
                                    <button
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                        onClick={() => simulateCopy(transactionId, "transaction")}
                                    >
                                        {copied === "transaction" ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-400" />}
                                    </button>
                                </div>
                            </div>

                            <div className="px-4 py-3 bg-green-50 text-green-600 rounded-lg flex items-center">
                                <div className="flex-1 text-sm">Connected to Solana Network</div>
                            </div>
                        </div>
                    )}

                    {/* Anonymous Tab */}
                    {currentShareOption === "anon" && (
                        <div className="space-y-4">
                            <div className="p-4 bg-yellow-50 rounded-lg flex items-start gap-3">
                                <Info className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-yellow-700">
                                    <strong>Anonymous sharing</strong> does not record recipient information. Use this feature carefully for sensitive medical records.
                                </p>
                            </div>

                            <div className="mb-4">
                                <label className="text-sm text-gray-500 mb-1 block">Access Duration</label>
                                <div className="relative">
                                    <button
                                        className="w-full p-3 rounded-lg bg-gray-100 text-left flex justify-between items-center"
                                        onClick={() => toggleDropdown('duration')}
                                    >
                                        {accessDuration}
                                        <ChevronDown className="w-4 h-4" />
                                    </button>
                                    {showDropdown === 'duration' && (
                                        <div className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-lg mt-1 z-10">
                                            {["6 hours", "12 hours", "24 hours", "48 hours", "1 week"].map((duration) => (
                                                <button
                                                    key={duration}
                                                    className="w-full p-3 text-left hover:bg-gray-50"
                                                    onClick={() => handleDropdownSelect('duration', duration)}
                                                >
                                                    {duration}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="text-sm text-gray-500 mb-1 block">View Limits</label>
                                <div className="relative">
                                    <button
                                        className="w-full p-3 rounded-lg bg-gray-100 text-left flex justify-between items-center"
                                        onClick={() => toggleDropdown('viewLimit')}
                                    >
                                        {viewLimit}
                                        <ChevronDown className="w-4 h-4" />
                                    </button>
                                    {showDropdown === 'viewLimit' && (
                                        <div className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-lg mt-1 z-10">
                                            {["Single View", "3 Views", "5 Views", "Unlimited"].map((limit) => (
                                                <button
                                                    key={limit}
                                                    className="w-full p-3 text-left hover:bg-gray-50"
                                                    onClick={() => handleDropdownSelect('viewLimit', limit)}
                                                >
                                                    {limit}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="text-sm text-gray-500 mb-1 block">Permission Level</label>
                                <div className="relative">
                                    <button
                                        className="w-full p-3 rounded-lg bg-gray-100 text-left flex justify-between items-center"
                                        onClick={() => toggleDropdown('permissionLevel')}
                                    >
                                        {permissionLevel}
                                        <ChevronDown className="w-4 h-4" />
                                    </button>
                                    {showDropdown === 'permissionLevel' && (
                                        <div className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-lg mt-1 z-10">
                                            {["View Only", "View & Download", "View & Comment"].map((level) => (
                                                <button
                                                    key={level}
                                                    className="w-full p-3 text-left hover:bg-gray-50"
                                                    onClick={() => handleDropdownSelect('permissionLevel', level)}
                                                >
                                                    {level}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="text-sm text-gray-500 mb-1 block">Access Code</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={accessCode}
                                        readOnly
                                        className="w-full p-3 rounded-lg bg-gray-100 pr-10"
                                    />
                                    <button
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                        onClick={() => simulateCopy(accessCode, "accessCode")}
                                    >
                                        {copied === "accessCode" ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-400" />}
                                    </button>
                                </div>
                                <p className="text-xs text-gray-400 mt-1">Share this code with intended recipient</p>
                            </div>

                            <div className="mb-4">
                                <label className="text-sm text-gray-500 mb-1 block">Shared Link</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={shareLink}
                                        readOnly
                                        className="w-full p-3 rounded-lg bg-gray-100 pr-10"
                                    />
                                    <button
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                        onClick={() => simulateCopy(shareLink, "shareLink")}
                                    >
                                        {copied === "shareLink" ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-400" />}
                                    </button>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="text-sm text-gray-500 mb-1 block">Notes for Recipient (Optional)</label>
                                <textarea
                                    rows={4}
                                    value={anonymousNotes}
                                    onChange={(e) => setAnonymousNotes(e.target.value)}
                                    placeholder="Add a message for the recipient..."
                                    className="w-full p-3 rounded-lg bg-gray-100 resize-none"
                                />
                            </div>
                        </div>
                    )}

                    {/* Temporary Link Tab */}
                    {currentShareOption === "temp" && (
                        <div className="space-y-4">
                            <div className="mb-4">
                                <label className="text-sm text-gray-500 mb-1 block">Access Duration</label>
                                <div className="relative">
                                    <button
                                        className="w-full p-3 rounded-lg bg-gray-100 text-left flex justify-between items-center"
                                        onClick={() => toggleDropdown('duration')}
                                    >
                                        {accessDuration}
                                        <ChevronDown className="w-4 h-4" />
                                    </button>
                                    {showDropdown === 'duration' && (
                                        <div className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-lg mt-1 z-10">
                                            {["6 hours", "12 hours", "24 hours", "48 hours", "1 week"].map((duration) => (
                                                <button
                                                    key={duration}
                                                    className="w-full p-3 text-left hover:bg-gray-50"
                                                    onClick={() => handleDropdownSelect('duration', duration)}
                                                >
                                                    {duration}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="text-sm text-gray-500 mb-1 block">Shared Link</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value="healthapp.com/share/tmp/tx29b7f..."
                                        readOnly
                                        className="w-full p-3 rounded-lg bg-gray-100 pr-10"
                                    />
                                    <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                        <Copy className="w-4 h-4 text-gray-400" />
                                    </button>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="text-sm text-gray-500 mb-1 block">Email</label>
                                <input
                                    type="email"
                                    placeholder="recipient@example.com"
                                    className="w-full p-3 rounded-lg bg-gray-100"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="text-sm text-gray-500 mb-1 block">QR Code</label>
                                <div className="bg-white border border-gray-200 p-4 rounded-lg flex justify-center mb-2">
                                    <img
                                        src="/api/placeholder/160/160"
                                        alt="QR Code"
                                        className="w-40 h-40 object-contain"
                                    />
                                </div>
                                <button className="w-full py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg">
                                    Download QR Code
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Create Share Link Button */}
                    <button
                        className="w-full py-4 bg-indigo-600 text-white rounded-lg font-medium mt-4"
                        onClick={openModal}
                    >
                        Create Share Link
                    </button>
                </div>

                <BottomNavigation />
            </main>

            {/* Record Modal */}
            {showRecordModal && activeRecord && (
                <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-end z-50">
                    <div className="bg-white rounded-t-2xl w-full max-w-md p-6 shadow-xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">{activeRecord.name}</h3>
                            <button onClick={() => setShowRecordModal(false)}>
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        <div className="space-y-2">
                            {checkupDates.map(({ date }, index) => (
                                <div
                                    key={index}
                                    className="flex justify-between items-center px-4 py-2 border border-gray-200 rounded-full text-sm"
                                >
                                    <span className="text-gray-700">Date: {date}</span>
                                    <button className="text-gray-400 hover:text-red-500 text-sm">×</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-5/6 max-w-md shadow-lg relative">
                        <button
                            className="absolute top-3 right-3 text-gray-400 hover:text-black"
                            onClick={closeModal}
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <div className="mb-4 flex justify-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>
                        <h2 className="text-lg font-bold text-center text-gray-800 mb-2">Access Shared Successfully!</h2>
                        <p className="text-sm text-gray-600 text-center mb-4">
                            You've shared {selectedRecords.length} medical records{currentShareOption === "wallet" ? " via Solana wallet" : currentShareOption === "anon" ? " anonymously" : ""}
                        </p>
                        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                            <h3 className="text-sm font-medium mb-2">Shared Records:</h3>
                            <ul className="text-sm text-gray-600">
                                {selectedRecords.map((record) => (
                                    <li key={record.id} className="mb-1">• {record.name}</li>
                                ))}
                            </ul>
                        </div>
                        <button
                            onClick={closeModal}
                            className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium"
                        >
                            Done
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}