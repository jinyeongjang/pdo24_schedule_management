import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabase';

const MyPage: React.FC = () => {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState('');
    const [nickname, setNickname] = useState('');
    const [schedules, setSchedules] = useState<any[]>([]);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { data } = await supabase.auth.getUser();
            if (data.user) {
                setUser(data.user);
                setEmail(data.user.email);
                setNickname(data.user.user_metadata?.nickname || '');
            }
            setLoading(false);
        };

        fetchUser();
    }, []);

    useEffect(() => {
        if (user) {
            const fetchSchedules = async () => {
                const { data, error } = await supabase.from('schedules').select('*').eq('user_id', user.id).order('created_at', { ascending: false });

                if (error) {
                    console.error('Error fetching schedules:', error);
                } else {
                    setSchedules(data || []);
                }
            };

            fetchSchedules();
        }
    }, [user]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        const updates = {
            email,
            user_metadata: {
                nickname,
            },
        };

        const { error } = await supabase.auth.updateUser(updates);

        setLoading(false);

        if (error) {
            setError('프로필 업데이트 중 오류가 발생했습니다.');
        } else {
            setMessage('프로필이 성공적으로 업데이트되었습니다.');
        }
    };

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (!error) {
            router.push('/login');
        }
    };

    if (loading) return <p>로딩 중...</p>;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100 dark:bg-gray-900">
            <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">마이페이지</h1>
            <form onSubmit={handleUpdateProfile} className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg space-y-6">
                {error && <p className="text-red-500">{error}</p>}
                {message && <p className="text-green-500">{message}</p>}
                <div>
                    <label htmlFor="email" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                        이메일
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="이메일을 입력하세요"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="nickname" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                        닉네임
                    </label>
                    <input
                        id="nickname"
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="닉네임을 입력하세요"
                    />
                </div>
                <div className="flex justify-between items-center space-x-4">
                    <button
                        type="submit"
                        className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                    >
                        {loading ? '업데이트 중...' : '업데이트'}
                    </button>
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="flex-1 py-2 px-4 bg-red-500 text-white rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                        로그아웃
                    </button>
                </div>
            </form>
            <div className="w-full max-w-2xl mt-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">내 일정</h2>
                {schedules.length === 0 ? (
                    <p className="text-gray-700 dark:text-gray-300">등록된 일정이 없습니다.</p>
                ) : (
                    <div className="space-y-4">
                        {schedules.map((schedule) => (
                            <div key={schedule.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{schedule.title}</h3>
                                <p className="text-gray-700 dark:text-gray-300">{schedule.description}</p>
                                <p className="text-gray-500 dark:text-gray-400">일정 날짜: {new Date(schedule.date).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}</p>
                                <p className="text-gray-500 dark:text-gray-400">생성 날짜: {new Date(schedule.created_at).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyPage;
