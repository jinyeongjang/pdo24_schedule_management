import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabase';
import { motion } from 'framer-motion';

const ScheduleView: React.FC = () => {
    const router = useRouter();
    const [schedules, setSchedules] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const goBack = () => router.back();
    const goToScheduleAdd = () => router.push('/schedule-add');

    const fetchSchedules = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('schedules').select('*').order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching schedules:', error);
        } else {
            setSchedules(data || []);
        }
        setLoading(false);
    };

    const subscribeToScheduleChanges = () => {
        return supabase.channel('public:schedules').on('postgres_changes', { event: '*', schema: 'public', table: 'schedules' }, fetchSchedules).subscribe();
    };

    useEffect(() => {
        fetchSchedules();
        const channel = subscribeToScheduleChanges();
        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    useEffect(() => {
        if (router.query.success === 'true') {
            setShowSuccessMessage(true);
            setTimeout(() => setShowSuccessMessage(false), 3000);
        }
    }, [router.query.success]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const filteredSchedules = schedules.filter(
        (schedule) => schedule.title.toLowerCase().includes(searchQuery.toLowerCase()) || schedule.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderLoading = () => (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100 dark:bg-gray-900">
            <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">일정 확인 페이지</h1>
            <p className="mb-8 text-lg text-gray-700 dark:text-gray-300">일정을 불러오는 중...</p>
        </div>
    );

    const renderSuccessMessage = () => (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mb-4 p-4 bg-green-500 text-white rounded-lg shadow-lg">
            일정이 성공적으로 등록되었습니다!
        </motion.div>
    );

    const renderSchedules = () => (
        <div className="w-full max-w-2xl flex flex-col gap-4">
            {filteredSchedules.map((schedule) => (
                <div key={schedule.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">{schedule.title}</h2>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">{schedule.description}</p>
                    <p className="text-gray-500 dark:text-gray-400">일정 날짜: {new Date(schedule.date).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}</p>
                    <p className="text-gray-500 dark:text-gray-400">생성 날짜: {new Date(schedule.created_at).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}</p>
                </div>
            ))}
        </div>
    );

    if (loading) return renderLoading();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100 dark:bg-gray-900">
            <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">일정 확인 페이지</h1>
            <p className="mb-8 text-lg text-gray-700 dark:text-gray-300">여기에서 일정을 확인할 수 있습니다.</p>
            {showSuccessMessage && renderSuccessMessage()}
            <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="검색어를 입력하세요..."
                className="mb-8 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white w-full max-w-2xl"
            />
            {renderSchedules()}
            <div className="mt-8 flex justify-between w-full max-w-xs">
                <button
                    onClick={goBack}
                    className="flex-1 mx-2 p-4 bg-gray-200 dark:bg-gray-800 shadow-md rounded-xl flex items-center justify-center transition-transform transform hover:scale-105 hover:shadow-xl custom-hover-cursor"
                >
                    이전으로
                </button>
                <button
                    onClick={goToScheduleAdd}
                    className="flex-1 mx-2 p-4 bg-blue-500 text-white shadow-md rounded-xl flex items-center justify-center transition-transform transform hover:scale-105 hover:shadow-xl custom-hover-cursor"
                >
                    일정 등록
                </button>
            </div>
        </div>
    );
};

export default ScheduleView;
