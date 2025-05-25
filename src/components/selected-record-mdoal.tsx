import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SelectedRecordModalProps {
    isOpen: boolean;
    onClose: () => void;
    recordType: string;
    dates: string[];
    onDeleteDate: (date: string) => void;
}

const SelectedRecordModal: React.FC<SelectedRecordModalProps> = ({
                                                                     isOpen,
                                                                     onClose,
                                                                     recordType,
                                                                     dates,
                                                                     onDeleteDate,
                                                                 }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-end justify-center bg-opacity-30"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="bg-white rounded-t-3xl w-full max-w-md p-6"
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">{recordType}</h2>
                            <button onClick={onClose} className="text-gray-500 text-lg">×</button>
                        </div>

                        {/* Date List */}
                        <div className="space-y-3">
                            {dates.map((date) => (
                                <div
                                    key={date}
                                    className="flex justify-between items-center px-4 py-3 bg-white border border-indigo-200 rounded-full shadow-sm text-gray-600"
                                >
                                    <span className="text-sm font-medium">Date: {date}</span>
                                    <button
                                        onClick={() => onDeleteDate(date)}
                                        className="text-gray-400 hover:text-red-500 text-sm font-bold"
                                    >
                                        x
                                    </button>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SelectedRecordModal;
