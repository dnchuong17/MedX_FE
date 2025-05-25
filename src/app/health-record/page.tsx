"use client";
import React, { useState, useEffect } from "react";
import {

    ChevronDown,
} from "lucide-react";
import BottomNavigation from "@/components/navbar";
import { useRouter } from "next/navigation";
import AddButton from "@/components/health-record/add.button";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";


import { getUserRecord } from "@/utils/api";
import nacl from "tweetnacl";
import bs58 from "bs58";
import { createHash } from "crypto";
import sodium from 'libsodium-wrappers-sumo';
import PageHeader from "@/components/pagination";


export interface UserRecord {
    url: string;
    versionOf: string | null;
    doctor: string;
    category: string;
    facility: string;
    date: string | null;
    notes: string;
    encryptedData: string;
    fileName: string;
}


interface UIRecord {
    id: number;
    title: string;
    date: string;
    doctor?: string;
    type: string;
    status: string;
    url?: string;
    notes?: string;
    encryptedData?: string;
    fileName: string;
}


export default function HealthRecordsApp() {
    const { connected, publicKey, signMessage } = useWallet();
    const [selectedRecords, setSelectedRecords] = useState<number[]>([]);
    const [filterOption, setFilterOption] = useState("all");
    const [sortOption, setSortOption] = useState("date-newest");
    const [filteredRecords, setFilteredRecords] = useState<UIRecord[]>([]);
    const [allRecords, setAllRecords] = useState<UIRecord[]>([]);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();


    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [, setSignature] = useState<string | null>(null);
    const [, setSeed] = useState<Uint8Array | null>(null);
    const [curvePrivateKey, setCurvePrivateKey] = useState<Uint8Array | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [authError, setAuthError] = useState<string | null>(null);
    const [curvePublicKey, setCurvePublicKey] = useState<Uint8Array | null>(null);


    const authenticateUser = async () => {
        if (!connected || !publicKey || !signMessage) {
            setAuthError("Wallet not connected or doesn't support message signing.");
            return;
        }


        try {
            setIsAuthenticating(true);
            setAuthError(null);


            const message = `Authenticate health record access`;
            const messageBytes = new TextEncoder().encode(message);
            const messageSignature = await signMessage(messageBytes);
            const signatureBase58 = bs58.encode(messageSignature);


            const isValid = nacl.sign.detached.verify(
                messageBytes,
                messageSignature,
                publicKey.toBytes()
            );


            if (isValid) {
                await sodium.ready;
                const derivedSeed = createHash("sha256").update(messageSignature).digest();
                const keypair = nacl.sign.keyPair.fromSeed(new Uint8Array(derivedSeed));


                const curvePrivKey = sodium.crypto_sign_ed25519_sk_to_curve25519(keypair.secretKey);
                const curvePubKey = sodium.crypto_sign_ed25519_pk_to_curve25519(keypair.publicKey);

                setSeed(new Uint8Array(derivedSeed));
                setCurvePrivateKey(curvePrivKey);
                setCurvePublicKey(curvePubKey);
                setSignature(signatureBase58);
                setIsAuthenticated(true);
                setSuccessMessage("Authentication successful! You can now decrypt your health records.");
                setTimeout(() => setSuccessMessage(null), 3000);
            } else {
                setAuthError("Signature verification failed.");
            }
        } catch (err) {
            console.error("Authentication error:", err);
            setAuthError("Failed to authenticate. Please try again.");
        } finally {
            setIsAuthenticating(false);
        }
    };


    const transformRecords = (apiRecords: UserRecord[]): UIRecord[] => {
        return apiRecords.map((record, index) => ({
            id: index + 1,
            title: record.category || "Health Record",
            date: record.date ? formatDate(record.date) : "N/A",
            doctor: record.doctor,
            type: record.category || "General",
            location: record.facility || "Unknown",
            status: record.versionOf ? "Updated" : "Shared",
            url: record.url,
            notes: record.notes,
            encryptedData: record.encryptedData,
            fileName: record.fileName,
        }));
    };


    const formatDate = (dateString: string): string => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-GB');
        } catch {
            return dateString;
        }
    };


    const fetchUserRecords = async () => {
        try {
            setLoading(true);
            setError(null);

            const apiRecords = await getUserRecord() as UserRecord[];
            const transformedRecords = transformRecords(apiRecords);
            setAllRecords(transformedRecords);
        } catch (err) {
            console.error("Error fetching user records:", err);
            setError(err instanceof Error ? err.message : "Failed to fetch records");
        } finally {
            setLoading(false);
        }
    };


    const openRecord = async (record: UIRecord & { encryptedData?: string }) => {
        if (!isAuthenticated || !curvePrivateKey || !curvePublicKey) {
            setAuthError("Please authenticate first to decrypt and view your health records.");
            return;
        }

        try {
            setLoading(true);
            let decryptedBlob: Blob | null = null;

            if (record.encryptedData) {
                await sodium.ready;
                const cleaned = record.encryptedData.replace(/[\s\n\r]+/g, "").trim();
                let encrypted: Uint8Array;

                try {
                    encrypted = sodium.from_base64(cleaned, sodium.base64_variants.ORIGINAL);
                } catch (err) {
                    console.error("Base64 decoding failed:", err);
                    throw new Error("Invalid base64 string");
                }

                const decryptedData = sodium.crypto_box_seal_open(
                    encrypted,
                    curvePublicKey,
                    curvePrivateKey
                );

                if (!decryptedData) throw new Error("Decryption failed.");
                const mimeType = record.fileName?.endsWith(".pdf")
                    ? "application/pdf"
                    : record.fileName?.endsWith(".json")
                        ? "application/json"
                        : record.fileName?.endsWith(".png")
                            ? "image/png"
                            : record.fileName?.endsWith(".jpg") || record.fileName?.endsWith(".jpeg")
                                ? "image/jpeg"
                                : "application/octet-stream";

                decryptedBlob = new Blob([decryptedData], { type: mimeType });
            }

            if (decryptedBlob) {
                const decryptedUrl = URL.createObjectURL(decryptedBlob);
                const newWindow = window.open('', '_blank');
                if (newWindow) {
                    if (decryptedBlob.type.startsWith('image/')) {
                        newWindow.document.write(`
                        <html>
                            <head><title>Health Record - ${record.title}</title></head>
                            <body style="margin:0; display:flex; justify-content:center; align-items:center; min-height:100vh; background:#f5f5f5;">
                                <img src="${decryptedUrl}" style="max-width:100%; max-height:100%; object-fit:contain;" />
                            </body>
                        </html>
                    `);
                    } else {
                        newWindow.location.href = decryptedUrl;
                    }
                } else {
                    const link = document.createElement('a');
                    link.href = decryptedUrl;
                    link.download = `decrypted-${record.title}`;
                    link.click();
                }
                setTimeout(() => URL.revokeObjectURL(decryptedUrl), 60000);
            } else {
                throw new Error("No valid decrypted data found.");
            }
        } catch (error) {
            console.error("Error opening/decrypting record:", error);
            setError("Failed to decrypt and open the health record. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const toggleDropdown = (type: string) => {
        setOpenDropdown(openDropdown === type ? null : type);
    };


    const toggleSelectRecord = (id: number) => {
        setSelectedRecords((prev) =>
            prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
        );
    };


    const toggleSelectAll = () => {
        if (selectedRecords.length === filteredRecords.length) {
            setSelectedRecords([]);
        } else {
            setSelectedRecords(filteredRecords.map((r) => r.id));
        }
    };


    const filterByType = (type: string) => {
        setFilterOption(type === "all" ? "all" : `type-${type}`);
        setOpenDropdown(null);
    };


    const filterByStatus = (status: string) => {
        setFilterOption(status === "all" ? "all" : `status-${status}`);
        setOpenDropdown(null);
    };


    const handleDateSort = (option: string) => {
        setSortOption(option);
        setOpenDropdown(null);
    };


    const handleClick = () => {
        router.push('/health-record/temporary-link');
    };


    const getUniqueCategories = () => {
        const categories = [...new Set(allRecords.map(r => r.type))];
        return categories.filter(Boolean);
    };


    useEffect(() => {
        fetchUserRecords();
    }, []);


    useEffect(() => {
        let filtered = [...allRecords];


        if (filterOption.startsWith("type-")) {
            const type = filterOption.slice(5);
            filtered = type === "all" ? filtered : filtered.filter((r) => r.type === type);
        } else if (filterOption.startsWith("status-")) {
            const status = filterOption.slice(7);
            filtered = status === "all" ? filtered : filtered.filter((r) => r.status === status);
        }


        filtered.sort((a, b) => {
            const parseDate = (dateStr: string) => {
                if (dateStr === "N/A") return new Date(0);
                const parts = dateStr.split("/");
                if (parts.length === 3) {
                    return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
                }
                return new Date(dateStr);
            };


            const dateA = parseDate(a.date);
            const dateB = parseDate(b.date);


            return sortOption === "date-newest"
                ? dateB.getTime() - dateA.getTime()
                : dateA.getTime() - dateB.getTime();
        });


        setFilteredRecords(filtered);
        setSelectedRecords([]);
    }, [filterOption, sortOption, allRecords]);


    if (loading && !isAuthenticating) {
        return (
            <div className="min-h-screen flex justify-center items-center p-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading health records...</p>
                </div>
            </div>
        );
    }


    return (
        <div className="min-h-screen flex justify-center p-4">
            <div className="bg-white w-full max-w-md overflow-hidden relative pb-20">


                <div className="p-4 flex items-center justify-between">
                    <PageHeader title="Health Record"/>
                </div>

                <div className="px-4 mb-4">
                    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-indigo-800 mb-2">Wallet & Authentication</h3>
                        {!connected ? (
                            <div className="space-y-2">
                                <p className="text-sm text-indigo-600">Connect your wallet to decrypt health records</p>
                                <WalletMultiButton className="w-full"/>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-green-600">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                                            stroke="currentColor" strokeWidth="2" fill="none"/>
                                        <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2"
                                              strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <span className="text-sm font-medium">Wallet Connected</span>
                                </div>


                                <div
                                    className={`flex items-center gap-2 ${isAuthenticated ? 'text-green-600' : 'text-orange-600'}`}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                                            stroke="currentColor" strokeWidth="2" fill="none"/>
                                        {isAuthenticated &&
                                            <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2"
                                                  strokeLinecap="round" strokeLinejoin="round"/>}
                                    </svg>
                                    <span className="text-sm font-medium">
                                       {isAuthenticated ? 'Authenticated - Can decrypt records' : 'Authentication Required for Decryption'}
                                   </span>
                                </div>


                                {!isAuthenticated && (
                                    <button
                                        onClick={authenticateUser}
                                        disabled={isAuthenticating}
                                        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg text-sm font-medium disabled:opacity-50"
                                    >
                                        {isAuthenticating ? 'Authenticating...' : 'Authenticate to Decrypt Records'}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>


                {successMessage && (
                    <div className="px-4 mb-4">
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                            {successMessage}
                        </div>
                    </div>
                )}


                {authError && (
                    <div className="px-4 mb-4">
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                            {authError}
                            <button
                                onClick={() => setAuthError(null)}
                                className="absolute top-0 bottom-0 right-0 px-4 py-3"
                            >
                                <span className="sr-only">Dismiss</span>
                                ×
                            </button>
                        </div>
                    </div>
                )}


                {error && (
                    <div className="px-4 mt-2">
                        <div className="bg-red-50 rounded-lg p-3 text-red-800 text-sm">
                            <p className="font-medium">Error loading records:</p>
                            <p>{error}</p>
                            <button
                                onClick={fetchUserRecords}
                                className="mt-2 text-red-600 font-medium underline"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                )}


                {filterOption !== "all" && (
                    <div className="px-4 mt-2">
                        <div
                            className="bg-indigo-50 rounded-lg p-2 text-indigo-800 text-sm flex justify-between items-center">
                           <span>
                               Showing: {filterOption.startsWith("type-") ? `Type - ${filterOption.slice(5)}` : `Status - ${filterOption.slice(7)}`}
                           </span>
                            <button
                                onClick={() => setFilterOption("all")}
                                className="text-indigo-600 font-medium"
                            >
                                Show All
                            </button>
                        </div>
                    </div>
                )}


                <div className="px-4 mt-4 flex justify-between items-center">
                    <div className="flex space-x-2">
                        {[
                            {
                                label: "Date",
                                options: [
                                    {label: "Newest First", value: "date-newest"},
                                    {label: "Oldest First", value: "date-oldest"},
                                ],
                                handler: handleDateSort,
                                active: sortOption,
                            },
                            {
                                label: "Type",
                                options: [
                                    {label: "All Types", value: "all"},
                                    ...getUniqueCategories().map(cat => ({label: cat, value: cat}))
                                ],
                                handler: filterByType,
                                active: filterOption,
                                prefix: "type-",
                            },
                            {
                                label: "Status",
                                options: [
                                    {label: "All Status", value: "all"},
                                    {label: "Shared", value: "Shared"},
                                    {label: "Pending Verification", value: "Pending Verification"},
                                ],
                                handler: filterByStatus,
                                active: filterOption,
                                prefix: "status-",
                            },
                        ].map(({label, options, handler, active, prefix = ""}, i) => (
                            <div key={i} className="relative">
                                <button
                                    onClick={() => toggleDropdown(label)}
                                    className={`${(active.startsWith(prefix) && active !== `${prefix}all`) ? "bg-indigo-100" : "bg-gray-100"} hover:bg-gray-200 rounded-full px-3 py-1.5 text-sm flex items-center shadow-sm`}
                                >
                                    {label}
                                    <ChevronDown className="ml-1 w-4 h-4"/>
                                </button>
                                {openDropdown === label && (
                                    <div
                                        className="absolute z-10 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 w-40">
                                        {options.map(({label, value}) => (
                                            <button
                                                key={value}
                                                onClick={() => handler(value)}
                                                className="w-full text-left px-4 py-2 hover:bg-indigo-50 text-sm"
                                            >
                                                {label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>


                    <div className="flex items-center ml-2">
                        <span className="text-sm mr-2 font-medium">Select All</span>
                        <div
                            onClick={toggleSelectAll}
                            className={`w-6 h-6 rounded-full border flex items-center justify-center cursor-pointer ${selectedRecords.length === filteredRecords.length && filteredRecords.length > 0 ? "bg-indigo-600 border-indigo-600" : "bg-white border-gray-300"}`}
                        >
                            {selectedRecords.length === filteredRecords.length && filteredRecords.length > 0 && (
                                <div className="w-3 h-3 rounded-full bg-white"/>
                            )}
                        </div>
                    </div>
                </div>


                <div className="px-4 py-4 space-y-4">
                    {filteredRecords.length > 0 ? (
                        filteredRecords.map((record) => (
                            <div
                                key={record.id}
                                className={`border border-gray-200 rounded-xl p-3 flex items-center shadow-sm transition-shadow ${
                                    isAuthenticated ? 'hover:shadow-md cursor-pointer' : 'opacity-75'
                                }`}
                                onClick={() => isAuthenticated ? openRecord(record) : setAuthError("Please authenticate first to view records")}
                            >
                                <div
                                    className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mr-3">
                                   <span className="text-2xl font-bold">
                                       {isAuthenticated ? "🔓" : "🔒"}
                                   </span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold">{record.title}</h3>
                                    <div className="text-sm space-y-0.5">
                                        <p><strong>Date:</strong> {record.date}</p>
                                        {record.doctor && <p><strong>Doctor:</strong> {record.doctor}</p>}
                                        <p><strong>Type:</strong> {record.type}</p>
                                        {record.notes && <p><strong>Notes:</strong> {record.notes}</p>}
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
                                    {!isAuthenticated && (
                                        <div
                                            className="mt-1 px-3 py-1 rounded-full text-xs inline-block bg-red-100 text-red-700">
                                            🔒 Encrypted - Authentication Required
                                        </div>
                                    )}
                                </div>
                                <div
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleSelectRecord(record.id);
                                    }}
                                    className={`w-6 h-6 rounded-full border flex items-center justify-center cursor-pointer ${
                                        selectedRecords.includes(record.id)
                                            ? "bg-indigo-600 border-indigo-600"
                                            : "bg-white border-gray-300"
                                    }`}
                                >
                                    {selectedRecords.includes(record.id) && (
                                        <div className="w-3 h-3 rounded-full bg-white"/>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-gray-500">
                                {allRecords.length === 0 ? "No health records found" : "No records match your filter criteria"}
                            </p>
                            {filterOption !== "all" && (
                                <button
                                    onClick={() => setFilterOption("all")}
                                    className="mt-2 text-indigo-600 font-medium"
                                >
                                    Show All Records
                                </button>
                            )}
                        </div>
                    )}
                </div>


                {/* Share Button */}
                <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
                    <button
                        disabled={selectedRecords.length === 0}
                        className={`${
                            selectedRecords.length > 0 ? "bg-indigo-600" : "bg-gray-400"
                        } text-white w-full py-3 rounded-full font-bold text-lg shadow-md transition-colors`}
                        onClick={handleClick}
                    >
                        {selectedRecords.length > 0
                            ? `Share ${selectedRecords.length} Record${selectedRecords.length > 1 ? "s" : ""}`
                            : "Select Records to Share"}
                    </button>
                    <AddButton/>
                </div>
                <BottomNavigation/>
            </div>
        </div>
    );
}



