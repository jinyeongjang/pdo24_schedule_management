import React, { useState, useEffect, useCallback } from 'react';
import TopBar from '../components/TopBar';
import Modal from '../components/Modal';
import AppDrawer from '../components/AppDrawer';

interface App {
    id: number;
    iconClass: string;
    title: string;
    component: React.FC;
}

const Home: React.FC = () => {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
    const [isMounted, setIsMounted] = useState<boolean>(false);
    const [selectedApp, setSelectedApp] = useState<App | null>(null);

    useEffect(() => {
        setIsMounted(true);
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme === 'dark') setIsDarkMode(true);
    }, []);

    useEffect(() => {
        if (isMounted) {
            document.documentElement.classList.toggle('dark', isDarkMode);
            localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        }
    }, [isDarkMode, isMounted]);

    const toggleDarkMode = useCallback(() => setIsDarkMode((prevMode) => !prevMode), []);

    const handleAppClick = (app: App) => {
        setSelectedApp(app);
    };

    const closeModal = () => {
        setSelectedApp(null);
    };

    if (!isMounted) return null;

    return (
        <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} bg-custom custom-cursor`}>
            <TopBar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
            <main className="flex flex-col flex-1 items-center justify-center">
                <AppDrawer onAppClick={handleAppClick} />
                <Modal isOpen={!!selectedApp} onClose={closeModal} app={selectedApp} />
            </main>
        </div>
    );
};

export default Home;
