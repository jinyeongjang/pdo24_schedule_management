import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabase';

const QtCheckView: React.FC = () => {
    const router = useRouter();
    const [qtChecks, setQtChecks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { data } = await supabase.auth.getUser();
            if (data.user) {
                setUser(data.user);
            }
        };

        const fetchQtChecks = async () => {
            const { data, error } = await supabase.from('qtcheck').select('*').order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching qt checks:', error);
            } else {
                setQtChecks(data || []);
            }
            setLoading(false);
        };

        fetchUser();
        fetchQtChecks();

        const channel = supabase
            .channel('realtime:public:qtcheck')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'qtcheck' }, (payload) => {
                if (payload.eventType === 'INSERT') {
                    setQtChecks((current) => [payload.new, ...current]);
                } else if (payload.eventType === 'UPDATE') {
                    setQtChecks((current) => current.map((item) => (item.id === payload.new.id ? payload.new : item)));
                } else if (payload.eventType === 'DELETE') {
                    setQtChecks((current) => current.filter((item) => item.id !== payload.old.id));
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const goBack = () => router.back();

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100 dark:bg-gray-900">
                <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">말씀 및 큐티 확인</h1>
                <p className="mb-8 text-lg text-gray-700 dark:text-gray-300">데이터를 불러오는 중...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100 dark:bg-gray-900">
            <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">말씀 및 큐티 확인</h1>
            {qtChecks.length === 0 ? (
                <p className="text-lg text-gray-700 dark:text-gray-300">등록된 기록이 없습니다.</p>
            ) : (
                <div className="w-full max-w-2xl flex flex-col gap-4">
                    {qtChecks.map((qtCheck) => (
                        <div key={qtCheck.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                            <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">{qtCheck.title}</h2>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">{qtCheck.description}</p>
                            <p className="text-gray-500 dark:text-gray-400">말씀 횟수: {qtCheck.word_count}</p>
                            <p className="text-gray-500 dark:text-gray-400">큐티 횟수: {qtCheck.qt_count}</p>
                            <p className="text-gray-500 dark:text-gray-400">날짜: {new Date(qtCheck.date).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}</p>
                            <p className="text-gray-500 dark:text-gray-400">등록일: {new Date(qtCheck.created_at).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}</p>
                        </div>
                    ))}
                </div>
            )}
            <button
                onClick={goBack}
                className="mt-8 px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                이전으로
            </button>
        </div>
    );
};

export default QtCheckView;
