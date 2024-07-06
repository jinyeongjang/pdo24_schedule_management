import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DynamicIsland from './DynamicIsland';
import { RxHamburgerMenu } from 'react-icons/rx';
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarTrigger } from '@/components/ui/menubar';

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

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (showDynamicIsland) {
            timer = setTimeout(() => {
                setShowDynamicIsland(false);
            }, 3000);
        }
        return () => clearTimeout(timer);
    }, [showDynamicIsland]);

    const formattedTime = currentTime.toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    });

    const handleToggleDarkMode = () => {
        toggleDarkMode();
        setDynamicMessage(isDarkMode ? '라이트모드가 켜졌습니다' : '다크모드가 켜졌습니다');
        setShowDynamicIsland(true);
    };

    return (
        <header className="relative bg-white dark:bg-gray-800 shadow-md p-2 flex justify-between items-center top-0 left-0 right-0 z-50">
            <div className="flex items-center">
                <Menubar>
                    <MenubarMenu>
                        <MenubarTrigger className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
                            <RxHamburgerMenu size={24} />
                        </MenubarTrigger>
                        <MenubarContent>
                            <MenubarItem className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700">일정 확인</MenubarItem>
                            <MenubarItem className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700">일정 등록</MenubarItem>
                            <MenubarItem className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700">로그인</MenubarItem>
                            <MenubarItem className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700">회원가입</MenubarItem>
                            <MenubarSeparator />
                        </MenubarContent>
                    </MenubarMenu>
                </Menubar>
                <h1 className="ml-2 text-sm sm:text-base font-bold text-gray-900 dark:text-white truncate">2024 포도리더스 캘린더</h1>
            </div>
            <div className="flex items-center">
                <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white mr-2">{formattedTime}</span>
                <div className="relative inline-block w-10 h-5 select-none transition duration-200 ease-in">
                    <motion.input
                        type="checkbox"
                        id="toggle"
                        checked={isDarkMode}
                        onChange={handleToggleDarkMode}
                        className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer"
                        layout
                    />
                    <motion.label htmlFor="toggle" className="toggle-label block overflow-hidden h-5 rounded-full bg-gray-300 cursor-pointer dark:bg-gray-700" layout>
                        <motion.span
                            className="absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-white shadow-md"
                            layout
                            transition={{ type: 'spring', stiffness: 700, damping: 30 }}
                            initial={false}
                            animate={{ x: isDarkMode ? 16 : 0 }}
                        />
                    </motion.label>
                </div>
            </div>
            <DynamicIsland message={dynamicMessage} show={showDynamicIsland} onClose={() => setShowDynamicIsland(false)} />
        </header>
    );
};

export default TopBar;
