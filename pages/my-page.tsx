import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';

const MyPage: React.FC = () => {
    const [userId, setUserId] = useState<string>('');
    const [schedules, setSchedules] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (user && user.id) {
                setUserId(user.id);
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        if (userId) {
            const fetchSchedules = async () => {
                const { data, error } = await supabase.from('schedules').select('*').eq('user_id', userId);

                if (error) {
                    console.error('Error fetching schedules:', error);
                } else {
                    setSchedules(data || []);
                }
                setLoading(false);
            };

            fetchSchedules();
        }
    }, [userId]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100 dark:bg-gray-900">
                <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">마이 페이지</h1>
                <p className="mb-8 text-lg text-gray-700 dark:text-gray-300">일정을 불러오는 중...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100 dark:bg-gray-900">
            <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">마이 페이지</h1>
            <div className="w-full max-w-2xl flex flex-col gap-4">
                {schedules.length > 0 ? (
                    schedules.map((schedule) => (
                        <div key={schedule.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                            <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">{schedule.title}</h2>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">{schedule.description}</p>
                            <p className="text-gray-500 dark:text-gray-400">일정 날짜: {new Date(schedule.date).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}</p>
                            <p className="text-gray-500 dark:text-gray-400">생성 날짜: {new Date(schedule.created_at).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-lg text-gray-700 dark:text-gray-300">등록된 일정이 없습니다.</p>
                )}
            </div>
        </div>
    );
};

export default MyPage;
