import React from 'react';
import { Menu } from 'lucide-react';

interface MobileMenuButtonProps {
    onClick: () => void;
}

export default function MobileMenuButton({ onClick }: MobileMenuButtonProps) {
    return (
        <button
            onClick={onClick}
            className="lg:hidden fixed top-4 left-4 z-30 p-3 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-green-200/50 text-gray-600 hover:text-green-600 transition-colors"
            aria-label="Abrir menú"
        >
            <Menu className="w-6 h-6" />
        </button>
    );
}
