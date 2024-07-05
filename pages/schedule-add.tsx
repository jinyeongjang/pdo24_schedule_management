import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { supabase } from '../utils/supabase';
import { v4 as uuidv4 } from 'uuid';

// 사용자 정보 타입 정의
interface User {
    id: string;
    [key: string]: any;
}

// 일정 추가 페이지 컴포넌트
const ScheduleAdd: React.FC = () => {
    const router = useRouter();
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [dateTime, setDateTime] = useState<Date | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);

    // 사용자 정보 가져오기
    useEffect(() => {
        const fetchUser = async () => {
            const { data } = await supabase.auth.getUser();
            if (data.user) {
                setUser(data.user);
            }
        };
        fetchUser();
    }, []);

    // 뒤로 가기 버튼 핸들러
    const goBack = () => {
        router.back();
    };

    // 폼 제출 핸들러
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !description || !dateTime || !user) {
            alert('모든 필드를 입력해주세요.');
            return;
        }

        setLoading(true);

        // 선택한 날짜와 시간을 UTC+9로 변환
        const kstDateTime = new Date(dateTime.getTime() + 9 * 60 * 60 * 1000);
        const kstCreatedAt = new Date(new Date().getTime() + 9 * 60 * 60 * 1000);

        // 일정 객체 생성
        const schedule = {
            id: uuidv4(),
            title,
            description,
            date: kstDateTime.toISOString(),
            createdAt: kstCreatedAt.toISOString(),
            userId: user.id,
        };

        // 일정 데이터베이스에 삽입
        const { data, error } = await supabase.from('schedules').insert([
            {
                title: schedule.title,
                description: schedule.description,
                date: schedule.date,
                created_at: schedule.createdAt,
                user_id: schedule.userId,
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
            router.push('/schedule-view?success=true'); // 일정 확인 페이지로 이동
        }
    };

    // 사용자가 인증되지 않은 경우
    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100 dark:bg-gray-900">
                <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">일정 등록</h1>
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

    // 일정 등록 폼
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100 dark:bg-gray-900">
            <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">일정 등록</h1>
            <p className="mb-8 text-lg text-gray-700 dark:text-gray-300">새로운 일정을 등록하세요</p>
            <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg space-y-6">
                <div>
                    <label htmlFor="title" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                        일정 제목
                    </label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="일정 제목을 입력하세요"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="description" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                        일정 설명
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="일정 설명을 입력하세요"
                        required
                    ></textarea>
                </div>
                <div>
                    <label htmlFor="dateTime" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                        일정 날짜 및 시간
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
                        {loading ? '저장 중...' : '일정 등록'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ScheduleAdd;
