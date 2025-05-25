import React from 'react';

const MedicalFolderIcon: React.FC = () => {
    return (
        <div className="relative">
            {/* Back folder */}
            <div className="w-28 h-24 bg-indigo-800 rounded-lg relative">
                <div className="absolute top-0 left-0 w-1/3 h-4 bg-indigo-800 rounded-tr-lg"></div>
            </div>

            {/* Front folder with gradient */}
            <div className="absolute top-4 left-4 w-28 h-24 bg-gradient-to-b from-indigo-600 to-blue-400 rounded-lg flex items-center justify-center">
                {/* Medical cross */}
                <div className="w-12 h-12 bg-blue-100 rounded-md relative">
                    <div className="absolute top-1/2 left-1/4 w-1/2 h-6 bg-white rounded-md -translate-y-1/2"></div>
                    <div className="absolute top-1/4 left-1/2 w-6 h-1/2 bg-white rounded-md -translate-x-1/2"></div>
                </div>
            </div>
        </div>
    );
};

export default MedicalFolderIcon;

