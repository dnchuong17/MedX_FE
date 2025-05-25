// src/components/QuickActionCard.tsx
import React from 'react';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

interface QuickActionCardProps {
    title: string;
    icon: LucideIcon;
    color: string;
    path: string;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({ title, icon: Icon, color, path }) => {
    return (
        <Link href={path}>
            <div className="flex flex-col items-center bg-white rounded-lg shadow-sm p-3 hover:shadow-md transition-shadow">
                <div className={`${color} p-3 rounded-full text-white mb-2`}>
                    <Icon size={20} />
                </div>
                <span className="text-xs font-medium text-gray-700 text-center">{title}</span>
            </div>
        </Link>
    );
};

export default QuickActionCard;