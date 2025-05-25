import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DecryptedRecordData {
    allergy: string;
    blood_type: string;
    ethnicity: string;
    treatment: string;
    diagnosis: string;
    date: string;
    suggest: string;
    appointmentId: number;
    temperature: number;
    blood_pressure: string;
    heart_rate: number;
    respiratory_rate: number;
    surgical_history: string;
}

interface Props {
    data: DecryptedRecordData;
    onClose: () => void;
}

const DecryptedRecordModal: React.FC<Props> = ({ data, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300); // match exit duration
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed inset-0 z-[999] flex items-center justify-center p-4"
                    onClick={handleBackdropClick}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <motion.div
                        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />
                    <motion.div
                        className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
                        initial={{ scale: 0.95, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 50 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 relative overflow-hidden">
                            <div className="absolute inset-0 bg-white bg-opacity-10 backdrop-blur-sm" />
                            <div className="relative z-10 flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">Decrypted Health Record</h2>
                                        <p className="text-purple-700 text-2xl">Appointment #{data.appointmentId}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleClose}
                                    className="bg-black bg-opacity-20 hover:bg-opacity-30 p-2 rounded-full transition-transform transform hover:scale-110 backdrop-blur-sm group"
                                >
                                    <svg className="w-6 h-6 text-white group-hover:text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                                <InfoCard title="Date" value={new Date(data.date).toLocaleString()} />
                                <InfoCard title="Blood Type" value={data.blood_type} highlight />
                                <InfoCard title="Ethnicity" value={data.ethnicity} highlight />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <VitalCard label="Temperature" value={`${data.temperature}°C`} />
                                <VitalCard label="Blood Pressure" value={data.blood_pressure} />
                                <VitalCard label="Heart Rate" value={`${data.heart_rate} bpm`} />
                                <VitalCard label="Respiratory Rate" value={`${data.respiratory_rate}/min`} />
                            </div>
                            <div className="space-y-4">
                                {[
                                    { title: "Allergies", value: data.allergy },
                                    { title: "Diagnosis", value: data.diagnosis },
                                    { title: "Treatment", value: data.treatment },
                                    { title: "Recommendations", value: data.suggest },
                                    { title: "Surgical History", value: data.surgical_history }
                                ].map((item, i) => (
                                    <div key={i} className="bg-white p-4 rounded-xl border border-purple-200 hover:shadow-md transition-shadow duration-200">
                                        <div className="text-xs text-purple-600 uppercase tracking-wide mb-2">{item.title}</div>
                                        <div className="text-gray-800 leading-relaxed">{item.value}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                            <div className="flex justify-between items-center">
                                <div className="text-sm text-gray-500">Record encrypted and secured</div>
                                <button
                                    onClick={handleClose}
                                    className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default DecryptedRecordModal;

const InfoCard = ({ title, value, highlight = false }: { title: string; value: string; highlight?: boolean }) => (
    <div className={`p-4 rounded-xl border ${highlight ? "bg-purple-50 border-purple-200" : "bg-gray-50 border-gray-200"} hover:shadow-md transition-shadow duration-200`}>
        <div className={`text-xs uppercase tracking-wide mb-1 ${highlight ? "text-purple-500" : "text-gray-500"}`}>{title}</div>
        <div className={`font-semibold ${highlight ? "text-purple-700" : "text-gray-800"}`}>{value}</div>
    </div>
);

const VitalCard = ({ label, value }: { label: string; value: string }) => (
    <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200">
        <div className="text-sm text-gray-600 mb-2">{label}</div>
        <div className="font-bold text-gray-800 text-2xl">{value}</div>
    </div>
);
