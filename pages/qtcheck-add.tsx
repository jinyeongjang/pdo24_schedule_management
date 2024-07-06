import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { supabase } from '../utils/supabase';
import { v4 as uuidv4 } from 'uuid';
import { motion, AnimatePresence } from 'framer-motion';

const QtCheckAdd: React.FC = () => {
    const router = useRouter();
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [dateTime, setDateTime] = useState<Date | null>(null);
    const [wordCount, setWordCount] = useState<number>(0);
    const [qtCount, setQtCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { data } = await supabase.auth.getUser();
            if (data.user) {
                setUser(data.user);
            }
        };
        fetchUser();
    }, []);

    const goBack = () => {
        router.back();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !description || !dateTime || !user || wordCount <= 0 || qtCount <= 0) {
            alert('모든 필드를 올바르게 입력해주세요.');
            return;
        }

        setLoading(true);

        const kstDateTime = new Date(dateTime.getTime() + 9 * 60 * 60 * 1000);
        const kstCreatedAt = new Date(new Date().getTime() + 9 * 60 * 60 * 1000);

        const { data, error } = await supabase.from('qtcheck').insert([
            {
                id: uuidv4(),
                user_id: user.id,
                title,
                description,
                word_count: wordCount,
                qt_count: qtCount,
                date: kstDateTime.toISOString(),
                created_at: kstCreatedAt.toISOString(),
            },
        ]);

        setLoading(false);

        if (error) {
            console.error('Error inserting data:', error);
            alert('데이터 삽입 중 오류가 발생했습니다.');
        } else {
            setTitle('');
            setDescription('');
            setDateTime(null);
            setWordCount(0);
            setQtCount(0);
            router.push('/qtcheck-view?success=true');
        }
    };

    const changeCount = (setter: React.Dispatch<React.SetStateAction<number>>, amount: number) => {
        setter((prev) => Math.max(0, prev + amount));
    };

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100 dark:bg-gray-900">
                <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">말씀 및 큐티 등록</h1>
                <p className="mb-8 text-lg text-gray-700 dark:text-gray-300">인증된 사용자만 등록이 가능합니다.</p>
                <button
                    onClick={() => router.push('/login')}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    로그인 페이지로 이동
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100 dark:bg-gray-900">
            <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">말씀 및 큐티 등록</h1>
            <p className="mb-8 text-lg text-gray-700 dark:text-gray-300">새로운 말씀 및 큐티 횟수를 등록하세요</p>
            <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg space-y-6">
                <div>
                    <label htmlFor="title" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                        제목
                    </label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="제목을 입력하세요"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="description" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                        설명
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="설명을 입력하세요"
                        required
                    ></textarea>
                </div>
                <div>
                    <label htmlFor="wordCount" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                        말씀 횟수
                    </label>
                    <div className="flex items-center justify-between">
                        <AnimatePresence mode="wait">
                            <motion.span
                                key={wordCount}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.2 }}
                                className="text-6xl text-gray-700 dark:text-gray-300"
                            >
                                {wordCount}
                            </motion.span>
                        </AnimatePresence>
                        <div className="flex flex-col space-y-2">
                            {[1, -1, 5, -5].map((value) => (
                                <motion.button
                                    key={value}
                                    whileTap={{ scale: 0.9 }}
                                    className={`px-4 py-3 ${value < 0 ? 'bg-red-500' : 'bg-green-500'} text-white rounded-lg shadow-md focus:outline-none text-lg font-bold`}
                                    type="button"
                                    onClick={() => changeCount(setWordCount, value)}
                                >
                                    {value > 0 ? `+${value}` : value}
                                </motion.button>
                            ))}
                        </div>
                    </div>
                </div>
                <div>
                    <label htmlFor="qtCount" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                        큐티 횟수
                    </label>
                    <div className="flex items-center justify-between">
                        <AnimatePresence mode="wait">
                            <motion.span
                                key={qtCount}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.2 }}
                                className="text-6xl text-gray-700 dark:text-gray-300"
                            >
                                {qtCount}
                            </motion.span>
                        </AnimatePresence>
                        <div className="flex flex-col space-y-2">
                            {[1, -1, 5, -5].map((value) => (
                                <motion.button
                                    key={value}
                                    whileTap={{ scale: 0.9 }}
                                    className={`px-4 py-3 ${value < 0 ? 'bg-red-500' : 'bg-green-500'} text-white rounded-lg shadow-md focus:outline-none text-lg font-bold`}
                                    type="button"
                                    onClick={() => changeCount(setQtCount, value)}
                                >
                                    {value > 0 ? `+${value}` : value}
                                </motion.button>
                            ))}
                        </div>
                    </div>
                </div>
                <div>
                    <label htmlFor="dateTime" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                        날짜 및 시간
                    </label>
                    <DatePicker
                        selected={dateTime}
                        onChange={(date: Date | null) => setDateTime(date)}
                        showTimeSelect
                        dateFormat="yyyy-MM-dd HH:mm"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholderText="날짜와 시간을 선택하세요"
                        required
                    />
                </div>
                <div className="flex justify-between items-center space-x-4">
                    <button
                        type="button"
                        onClick={goBack}
                        className="flex-1 py-2 px-4 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        이전으로
                    </button>
                    <button
                        type="submit"
                        className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                    >
                        {loading ? '저장 중...' : '등록'}
                    </button>
                </div>
                <div className="flex justify-center items-center space-x-4 mt-4">
                    <button
                        type="button"
                        onClick={() => router.push('/qtcheck-view')}
                        className="py-2 px-4 bg-blue-500 text-white rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        등록 큐티 확인
                    </button>
                </div>
            </form>
        </div>
    );
};

export default QtCheckAdd;
