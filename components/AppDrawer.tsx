import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { LuCalendarPlus, LuCalendarCheck2, LuKeyRound, LuLogOut, LuUser, LuUserPlus } from 'react-icons/lu';
import { supabase } from '../utils/supabase';
import { useRouter } from 'next/router';

interface App {
    id: number;
    icon: React.ReactNode;
    title: string;
    tooltip: string;
    path: string;
}

interface AppDrawerProps {
    onAppClick: (app: App) => void;
}

const initialApps: App[] = [
    { id: 1, icon: <LuCalendarCheck2 size={32} />, title: '일정 확인', tooltip: '일정을 확인합니다', path: '/schedule-view' },
    { id: 2, icon: <LuCalendarPlus size={32} />, title: '일정 등록', tooltip: '새로운 일정을 등록합니다', path: '/schedule-add' },
    { id: 3, icon: <LuKeyRound size={32} />, title: '로그인', tooltip: '일정을 등록하거나 수정하려면 로그인이 필요합니다.', path: '/login' },
    { id: 4, icon: <LuUserPlus size={32} />, title: '회원가입', tooltip: '새로운 계정을 생성합니다', path: '/signup' },
];

const AppDrawer: React.FC<AppDrawerProps> = ({ onAppClick }) => {
    const [apps, setApps] = useState<App[]>(initialApps);
    const [tooltip, setTooltip] = useState<{ id: number | null; text: string }>({ id: null, text: '' });
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        const checkUser = async () => {
            const { data } = await supabase.auth.getUser();
            if (data.user) {
                setUser(data.user);
            }
        };

        checkUser();
    }, []);

    const onDragEnd = (result: any) => {
        if (!result.destination) return;

        const reorderedApps = Array.from(apps);
        const [removed] = reorderedApps.splice(result.source.index, 1);
        reorderedApps.splice(result.destination.index, 0, removed);

        setApps(reorderedApps);
    };

    const showTooltip = (id: number, text: string) => {
        setTooltip({ id, text });
    };

    const hideTooltip = () => {
        setTooltip({ id: null, text: '' });
    };

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (!error) {
            setUser(null);
            window.location.reload();
        }
    };

    const filteredApps = apps.filter((app) => {
        if (user) {
            return app.id !== 3 && app.id !== 4; // Remove "로그인" and "회원가입" if user is logged in
        }
        return true;
    });

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="apps" direction="horizontal">
                {(provided) => (
                    <div className="relative grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4" {...provided.droppableProps} ref={provided.innerRef}>
                        {filteredApps.map((app, index) => (
                            <Draggable key={app.id} draggableId={`${app.id}`} index={index}>
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className="relative p-4 bg-gray-200 dark:bg-gray-800 shadow-md rounded-xl flex flex-col items-center justify-center transition-transform transform hover:scale-105 hover:shadow-xl custom-hover-cursor"
                                        onClick={() => onAppClick(app)}
                                        onMouseEnter={() => showTooltip(app.id, app.tooltip)}
                                        onMouseLeave={hideTooltip}
                                    >
                                        <div className="text-gray-700 dark:text-white">{app.icon}</div>
                                        <p className="mt-2 text-md font-semibold text-gray-900 dark:text-white">{app.title}</p>
                                        {tooltip.id === app.id && (
                                            <div className="absolute bottom-full mb-2 w-96 p-2 bg-gray-800 text-white text-center text-sm rounded-lg shadow-lg">{tooltip.text}</div>
                                        )}
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                        {user && (
                            <>
                                <div
                                    className="relative p-4 bg-gray-200 dark:bg-gray-800 shadow-md rounded-xl flex flex-col items-center justify-center transition-transform transform hover:scale-105 hover:shadow-xl custom-hover-cursor"
                                    onClick={() => router.push('/my-page')}
                                    onMouseEnter={() => showTooltip(5, '마이페이지')}
                                    onMouseLeave={hideTooltip}
                                >
                                    <div className="text-gray-700 dark:text-white">
                                        <LuUser size={32} />
                                    </div>
                                    <p className="mt-2 text-md font-semibold text-gray-900 dark:text-white">마이페이지</p>
                                </div>
                                <div
                                    className="relative p-4 bg-gray-200 dark:bg-gray-800 shadow-md rounded-xl flex flex-col items-center justify-center transition-transform transform hover:scale-105 hover:shadow-xl custom-hover-cursor"
                                    onClick={handleLogout}
                                    onMouseEnter={() => showTooltip(6, '로그아웃')}
                                    onMouseLeave={hideTooltip}
                                >
                                    <div className="text-gray-700 dark:text-white">
                                        <LuLogOut size={32} />
                                    </div>
                                    <p className="mt-2 text-md font-semibold text-gray-900 dark:text-white">로그아웃</p>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default AppDrawer;
