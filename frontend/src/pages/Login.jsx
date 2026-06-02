import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Cloud } from 'lucide-react';
import api from '../api';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', { username, password });
            localStorage.setItem('token', res.data.data.token);
            toast.success("Welcome back!");
            navigate('/dashboard');
            window.location.reload(); 
        } catch (err) {
            toast.error("Login failed: " + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="flex h-screen -mx-4 sm:-mx-6 lg:-mx-8 -my-8">
            <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-600 to-blue-500 text-white p-12 flex-col justify-between relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10 flex items-center space-x-2 text-2xl font-bold">
                    <Cloud className="w-8 h-8" />
                    <span>Platform</span>
                </div>
                <div className="relative z-10">
                    <h1 className="text-5xl font-extrabold mb-6 leading-tight">Securely store and share your media.</h1>
                    <p className="text-indigo-100 text-lg max-w-md">Everything you need in one place. Fast uploads, seamless sharing, and enterprise-grade security.</p>
                </div>
                <div className="relative z-10 text-sm text-indigo-200">© 2026 Platform Inc.</div>
            </div>
            
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center bg-white p-8">
                <div className="w-full max-w-md">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">Sign in to your account</h2>
                        <p className="text-slate-500">Don't have an account? <Link to="/register" className="text-indigo-600 font-semibold hover:text-indigo-500 hover:underline">Sign up</Link></p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                            <input 
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                placeholder="Enter your username" 
                                value={username} 
                                onChange={e=>setUsername(e.target.value)} 
                                required 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                            <input 
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                type="password" 
                                placeholder="••••••••" 
                                value={password} 
                                onChange={e=>setPassword(e.target.value)} 
                                required 
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl mt-6 hover:bg-indigo-700 active:scale-[0.98] transition-all flex justify-center items-center"
                        >
                            Sign In
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}