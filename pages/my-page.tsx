import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabase';

const MyPage: React.FC = () => {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [schedules, setSchedules] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const { data } = await supabase.auth.getUser();
            if (data.user) {
                setUser(data.user);
                fetchSchedules(data.user.id);
            } else {
                router.push('/login');
            }
        };

        checkUser();
    }, [router]);

    const fetchSchedules = async (userId: string) => {
        const { data, error } = await supabase.from('schedules').select('*').eq('user_id', userId);
        if (error) {
            console.error('Error fetching schedules:', error);
        } else {
            setSchedules(data || []);
        }
        setLoading(false);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        router.push('/login');
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100 dark:bg-gray-900">
            <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">마이페이지</h1>
            {user && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md space-y-4">
                    <div>
                        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">사용자 정보</h2>
                        <p className="text-gray-700 dark:text-gray-300">이메일: {user.email}</p>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">나의 일정</h2>
                        {schedules.length === 0 ? (
                            <p className="text-gray-700 dark:text-gray-300">등록된 일정이 없습니다.</p>
                        ) : (
                            <ul className="space-y-2">
                                {schedules.map((schedule) => (
                                    <li key={schedule.id} className="p-4 bg-gray-200 dark:bg-gray-700 rounded-lg">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{schedule.title}</h3>
                                        <p className="text-gray-700 dark:text-gray-300">{schedule.description}</p>
                                        <p className="text-gray-500 dark:text-gray-400">일정 날짜: {new Date(schedule.date).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}</p>
                                        <p className="text-gray-500 dark:text-gray-400">
                                            생성 날짜: {new Date(schedule.created_at).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full py-2 px-4 bg-red-500 text-white rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                        로그아웃
                    </button>
                </div>
            )}
        </div>
    );
};

export default MyPage;
