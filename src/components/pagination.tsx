"use client";

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PageHeaderProps {
    title: string;
    showBackButton?: boolean;
    onBackClick?: () => void;
    rightElement?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
                                                   title,
                                                   showBackButton = true,
                                                   onBackClick,
                                                   rightElement
                                               }) => {
    const router = useRouter();

    const handleBackClick = () => {
        if (onBackClick) {
            onBackClick();
        } else {
            router.back();
        }
    };

    return (
        <div className="w-full border-b border-indigo-100 bg-white relative">
            <div className="max-w-screen-lg mx-auto flex items-center justify-between px-4 py-3 relative">
                {/* Nút quay lại bên trái */}
                <div>
                    {showBackButton && (
                        <button
                            onClick={handleBackClick}
                            className="p-2 rounded-full hover:bg-indigo-100 transition"
                            aria-label="Go back"
                        >
                            <ArrowLeft className="h-5 w-5 text-indigo-600"/>
                        </button>
                    )}
                </div>

                <h1 className="absolute left-1/2 transform -translate-x-1/2 text-xl font-bold text-indigo-600">
                    {title}
                </h1>

                <div>
                    {rightElement && (
                        <div className="flex items-center space-x-2">
                            {rightElement}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

};

export default PageHeader;
