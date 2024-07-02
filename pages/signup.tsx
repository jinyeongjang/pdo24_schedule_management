import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabase';

const Signup = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);

    const handleSignup = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signUp({
            email,
            password,
        });

        setLoading(false);

        if (error) {
            setError(error.message);
        } else {
            setSuccessMessage('회원가입이 완료되었습니다.');
            setTimeout(() => {
                router.push('/login'); // 회원가입 후 로그인 페이지로 이동
            }, 2000);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100 dark:bg-gray-900">
            <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">회원가입</h1>
            <form onSubmit={handleSignup} className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg space-y-6">
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
                <div>
                    <label htmlFor="confirm-password" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                        비밀번호 확인
                    </label>
                    <input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="비밀번호를 다시 입력하세요"
                        required
                    />
                </div>
                <div className="flex justify-between items-center space-x-4">
                    <button
                        type="submit"
                        className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                    >
                        {loading ? '회원가입 중...' : '회원가입'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Signup;
