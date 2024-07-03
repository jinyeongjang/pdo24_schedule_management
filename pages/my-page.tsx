import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabase';

const MyPage: React.FC = () => {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [schedules, setSchedules] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { data } = await supabase.auth.getUser();
            if (data.user) {
                setUser(data.user);
            } else {
                router.push('/login');
            }
        };

        fetchUser();
    }, [router]);

    useEffect(() => {
        if (user) {
            const fetchSchedules = async () => {
                const { data, error } = await supabase.from('schedules').select('*').eq('user_id', user.id);

                if (error) {
                    setError('일정을 불러오는 중 오류가 발생했습니다.');
                } else {
                    setSchedules(data || []);
                }
                setLoading(false);
            };

            fetchSchedules();
        }
    }, [user]);

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
            {error && <p className="text-red-500">{error}</p>}
            <div className="w-full max-w-2xl flex flex-col gap-4">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">프로필</h2>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">이메일: {user.email}</p>
                </div>
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">내 일정</h2>
                {schedules.length > 0 ? (
                    schedules.map((schedule) => (
                        <div key={schedule.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">{schedule.title}</h3>
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
