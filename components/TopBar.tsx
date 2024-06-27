// src/components/TopBar.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DynamicIsland from './DynamicIsland';

interface TopBarProps {
    isDarkMode: boolean;
    toggleDarkMode: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ isDarkMode, toggleDarkMode }) => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [showDynamicIsland, setShowDynamicIsland] = useState(false);
    const [dynamicMessage, setDynamicMessage] = useState('');

    useEffect(() => {
        const intervalId = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(intervalId);
    }, []);

    const formattedTime = currentTime.toLocaleTimeString();
    const formattedDate = currentTime.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
    });

    const handleToggleDarkMode = () => {
        toggleDarkMode();
        setDynamicMessage(isDarkMode ? '라이트모드가 켜졌습니다' : '다크모드가 켜졌습니다');
        setShowDynamicIsland(true);
    };

    const closeDynamicIsland = () => {
        setShowDynamicIsland(false);
    };

    return (
        <header className="bg-white dark:bg-gray-800 shadow-md p-2 flex justify-between items-center fixed top-0 left-0 right-0 z-50">
            <h1 className="text-lg font-bold text-gray-900 dark:text-white ml-4">개발블로그</h1>
            <div className="flex items-center">
                <span className="text-sm font-medium text-gray-900 dark:text-white mr-4">
                    {formattedDate} {formattedTime}
                </span>
                <div className="relative inline-block w-12 h-6 mr-2 select-none transition duration-200 ease-in">
                    <motion.input
                        type="checkbox"
                        id="toggle"
                        checked={isDarkMode}
                        onChange={handleToggleDarkMode}
                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                        layout
                    />
                    <motion.label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer dark:bg-gray-700" layout>
                        <motion.span
                            className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow-md"
                            layout
                            transition={{ type: 'spring', stiffness: 700, damping: 30 }}
                            initial={false}
                            animate={{ x: isDarkMode ? 20 : 0 }}
                        />
                    </motion.label>
                </div>
            </div>
            <DynamicIsland message={dynamicMessage} show={showDynamicIsland} onClose={closeDynamicIsland} />
        </header>
    );
};

export default TopBar;
