// src/components/Header.tsx
import React from 'react';
import { Bell, Menu } from 'lucide-react';

interface HeaderProps {
    title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
    return (
        <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-3">
                    <button className="text-gray-600">
                        <Menu size={24} />
                    </button>
                    <h1 className="text-lg font-bold text-indigo-700">{title}</h1>
                </div>
                <div className="flex items-center">
                    <button className="relative text-gray-600">
                        <Bell size={22} />
                        <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;