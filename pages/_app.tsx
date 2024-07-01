import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TopBar from '../components/TopBar';
import NavigationBar from '../components/NavigationBar';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }: AppProps) {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
    const [isMounted, setIsMounted] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme === 'dark') setIsDarkMode(true);
        setIsMounted(true); // 컴포넌트가 마운트된 후에 상태를 설정합니다.
    }, []);

    useEffect(() => {
        if (isMounted) {
            document.documentElement.classList.toggle('dark', isDarkMode);
            localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        }
    }, [isDarkMode, isMounted]);

    const toggleDarkMode = () => setIsDarkMode((prevMode) => !prevMode);

    // isMounted가 true일 때만 렌더링
    if (!isMounted) {
        return null;
    }

    const isHomePage = router.pathname === '/';

    return (
        <DndProvider backend={HTML5Backend}>
            <ToastContainer position="top-right" autoClose={2000} pauseOnHover={false} />
            <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} ${isHomePage ? 'bg-custom' : ''} custom-cursor`}>
                <TopBar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
                <main className="flex flex-col flex-1 items-center justify-center mb-16">
                    <Component {...pageProps} />
                </main>
                <NavigationBar />
            </div>
        </DndProvider>
    );
}

export default MyApp;
