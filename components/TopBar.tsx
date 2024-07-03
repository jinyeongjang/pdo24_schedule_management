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
            }, 3000); // 3초 후에 다이나믹 아일랜드를 닫습니다.
        }
        return () => clearTimeout(timer);
    }, [showDynamicIsland]);

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

    return (
        <header className="relative bg-white dark:bg-gray-800 shadow-md p-2 flex flex-wrap justify-between items-center top-0 left-0 right-0 z-50">
            <div className="flex items-center">
                <Menubar>
                    <MenubarMenu>
                        <MenubarTrigger>
                            <RxHamburgerMenu size={24} />
                        </MenubarTrigger>
                        <MenubarContent>
                            <MenubarItem>일정 확인</MenubarItem>
                            <MenubarItem>일정 등록</MenubarItem>
                            <MenubarItem>로그인</MenubarItem>
                            <MenubarItem>회원가입</MenubarItem>
                            <MenubarSeparator />
                        </MenubarContent>
                    </MenubarMenu>
                </Menubar>
                <div className="ml-2 md:ml-4 text-lg font-bold text-gray-900 dark:text-white">2024 포도리더스 캘린더.</div>
            </div>
            <div className="flex items-center mt-2 md:mt-0">
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
            <DynamicIsland message={dynamicMessage} show={showDynamicIsland} onClose={() => setShowDynamicIsland(false)} />
        </header>
    );
};

export default TopBar;
