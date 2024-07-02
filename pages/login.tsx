import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabase';
import { FaGoogle } from 'react-icons/fa';

const Login: React.FC = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const goBack = () => {
        router.back();
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        setLoading(false);

        if (error) {
            setError(error.message);
        } else {
            setSuccessMessage('로그인에 성공하였습니다.');
            setTimeout(() => {
                router.push('/'); // 로그인 후 메인 페이지로 이동
            }, 2000);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: process.env.NEXT_PUBLIC_REDIRECT_URI,
            },
        });
        setLoading(false);

        if (error) {
            setError(error.message);
        } else {
            setSuccessMessage('로그인에 성공하였습니다.');
            setTimeout(() => {
                router.push('/'); // 로그인 후 메인 페이지로 이동
            }, 2000);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100 dark:bg-gray-900">
            <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">로그인</h1>
            <p className="mb-8 text-lg text-gray-700 dark:text-gray-300">일정을 등록하거나 수정하려면 로그인이 필요합니다.</p>
            <form onSubmit={handleLogin} className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg space-y-6">
                {error && <p className="text-red-500">{error}</p>}
                {successMessage && <p className="text-green-500">{successMessage}</p>}
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
                    <label htmlFor="password" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                        비밀번호
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="비밀번호를 입력하세요"
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
                        {loading ? '로그인 중...' : '로그인'}
                    </button>
                </div>
            </form>
            <div className="mt-6 flex flex-col space-y-4 w-full max-w-md">
                <button
                    onClick={handleGoogleLogin}
                    className="w-full py-2 px-4 bg-red-500 text-white rounded-lg shadow-md flex items-center justify-center transition-transform transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 mb-2"
                >
                    <FaGoogle className="mr-2" /> 구글로 로그인
                </button>
            </div>
        </div>
    );
};

export default Login;
