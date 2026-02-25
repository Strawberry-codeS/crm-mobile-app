import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn, signUp } from '../lib/api/auth';

export default function Login() {
    const navigate = useNavigate();
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        setError('');
        setLoading(true);
        try {
            if (mode === 'login') {
                await signIn(email, password);
            } else {
                await signUp(email, password, name);
            }
            navigate('/');
        } catch (e: any) {
            setError(e.message || '登录失败，请重试');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-600 to-purple-800 flex flex-col items-center justify-center px-6">
            <div className="w-full max-w-sm">
                {/* Logo */}
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <span className="text-3xl">🎯</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white">CRM 工作台</h1>
                    <p className="text-violet-200 mt-1 text-sm">客户关系管理系统</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-3xl p-8 shadow-2xl">
                    {/* Tab */}
                    <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
                        <button
                            onClick={() => setMode('login')}
                            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${mode === 'login' ? 'bg-white text-violet-600 shadow-sm' : 'text-gray-400'
                                }`}
                        >
                            登录
                        </button>
                        <button
                            onClick={() => setMode('register')}
                            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${mode === 'register' ? 'bg-white text-violet-600 shadow-sm' : 'text-gray-400'
                                }`}
                        >
                            注册
                        </button>
                    </div>

                    <div className="space-y-4">
                        {mode === 'register' && (
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-2">姓名</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    placeholder="请输入姓名"
                                    className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-400"
                                />
                            </div>
                        )}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-2">邮箱</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="请输入邮箱"
                                className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-400"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-2">密码</label>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="请输入密码"
                                className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-400"
                                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="mt-4 bg-red-50 text-red-600 text-xs p-3 rounded-xl text-center">
                            {error}
                        </div>
                    )}

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full mt-6 py-4 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-2xl shadow-lg shadow-violet-200 transition-colors disabled:opacity-60"
                    >
                        {loading ? '处理中...' : mode === 'login' ? '登录' : '注册并登录'}
                    </button>
                </div>

                <p className="text-center text-violet-300 text-xs mt-6">
                    © 2026 CRM 工作台 · Powered by Supabase
                </p>
            </div>
        </div>
    );
}
