import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabase';
import { LuHome, LuCalendarPlus, LuCalendarCheck2, LuCalendar, LuSettings, LuLogOut, LuUser, LuKeyRound, LuUserPlus } from 'react-icons/lu';

const NavigationBar: React.FC = () => {
    const router = useRouter();
    const [selected, setSelected] = useState<string>('home');
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const checkUser = async () => {
            const { data } = await supabase.auth.getUser();
            if (data.user) {
                setUser(data.user);
            }
        };

        checkUser();
    }, []);

    const handleNavClick = (navItem: string, path: string) => {
        setSelected(navItem);
        router.push(path);
    };

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (!error) {
            setUser(null);
            router.push('/');
        }
    };

    return (
        <nav className="fixed bottom-0 w-full bg-white dark:bg-gray-800 shadow-lg">
            <ul className="flex justify-around items-center h-16">
                <li className="py-2">
                    <button
                        className={`flex flex-col items-center focus:outline-none hover:text-blue-500 dark:hover:text-blue-400 ${
                            selected === 'home' ? 'text-blue-500 dark:text-blue-400' : 'text-gray-800 dark:text-white'
                        }`}
                        onClick={() => handleNavClick('home', '/')}
                    >
                        <LuHome size={24} />
                        <span className="text-xs mt-1">메인</span>
                    </button>
                </li>
                <li className="py-2">
                    <button
                        className={`flex flex-col items-center focus:outline-none hover:text-blue-500 dark:hover:text-blue-400 ${
                            selected === 'view-schedule' ? 'text-blue-500 dark:text-blue-400' : 'text-gray-800 dark:text-white'
                        }`}
                        onClick={() => handleNavClick('view-schedule', '/schedule-view')}
                    >
                        <LuCalendarCheck2 size={24} />
                        <span className="text-xs mt-1">일정 확인</span>
                    </button>
                </li>
                <li className="py-2">
                    <button
                        className={`flex flex-col items-center focus:outline-none hover:text-blue-500 dark:hover:text-blue-400 ${
                            selected === 'add-schedule' ? 'text-blue-500 dark:text-blue-400' : 'text-gray-800 dark:text-white'
                        }`}
                        onClick={() => handleNavClick('add-schedule', '/schedule-add')}
                    >
                        <LuCalendarPlus size={24} />
                        <span className="text-xs mt-1">일정 등록</span>
                    </button>
                </li>
                <li className="py-2">
                    <button
                        className={`flex flex-col items-center focus:outline-none hover:text-blue-500 dark:hover:text-blue-400 ${
                            selected === 'calendar' ? 'text-blue-500 dark:text-blue-400' : 'text-gray-800 dark:text-white'
                        }`}
                        onClick={() => handleNavClick('calendar', '/calendar')}
                    >
                        <LuCalendar size={24} />
                        <span className="text-xs mt-1">달력</span>
                    </button>
                </li>
                {user ? (
                    <>
                        <li className="py-2">
                            <button
                                className={`flex flex-col items-center focus:outline-none hover:text-blue-500 dark:hover:text-blue-400 ${
                                    selected === 'my-page' ? 'text-blue-500 dark:text-blue-400' : 'text-gray-800 dark:text-white'
                                }`}
                                onClick={() => handleNavClick('my-page', '/my-page')}
                            >
                                <LuUser size={24} />
                                <span className="text-xs mt-1">마이페이지</span>
                            </button>
                        </li>
                        <li className="py-2">
                            <button
                                className={`flex flex-col items-center focus:outline-none hover:text-blue-500 dark:hover:text-blue-400 ${
                                    selected === 'logout' ? 'text-blue-500 dark:text-blue-400' : 'text-gray-800 dark:text-white'
                                }`}
                                onClick={handleLogout}
                            >
                                <LuLogOut size={24} />
                                <span className="text-xs mt-1">로그아웃</span>
                            </button>
                        </li>
                    </>
                ) : (
                    <>
                        <li className="py-2">
                            <button
                                className={`flex flex-col items-center focus:outline-none hover:text-blue-500 dark:hover:text-blue-400 ${
                                    selected === 'login' ? 'text-blue-500 dark:text-blue-400' : 'text-gray-800 dark:text-white'
                                }`}
                                onClick={() => handleNavClick('login', '/login')}
                            >
                                <LuKeyRound size={24} />
                                <span className="text-xs mt-1">로그인</span>
                            </button>
                        </li>
                        <li className="py-2">
                            <button
                                className={`flex flex-col items-center focus:outline-none hover:text-blue-500 dark:hover:text-blue-400 ${
                                    selected === 'signup' ? 'text-blue-500 dark:text-blue-400' : 'text-gray-800 dark:text-white'
                                }`}
                                onClick={() => handleNavClick('signup', '/signup')}
                            >
                                <LuUserPlus size={24} />
                                <span className="text-xs mt-1">회원가입</span>
                            </button>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default NavigationBar;
