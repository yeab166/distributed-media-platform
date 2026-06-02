import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Cloud, LogOut, UserCircle } from 'lucide-react';

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem('token');

    // Hide navbar on login/register pages
    if (location.pathname === '/login' || location.pathname === '/register') return null;

    const logout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;
    const linkStyle = (path) => `
        px-3 py-2 rounded-md text-sm font-medium transition-colors
        ${isActive(path) ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}
    `;

    return (
        <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-8">
                        <Link to="/dashboard" className="flex items-center text-indigo-600 font-bold text-xl tracking-tight">
                            <Cloud className="w-6 h-6 mr-2" />
                            Platform
                        </Link>
                        {token && (
                            <div className="hidden md:flex space-x-1">
                                <Link to="/dashboard" className={linkStyle('/dashboard')}>Dashboard</Link>
                                <Link to="/media" className={linkStyle('/media')}>Library</Link>
                                <Link to="/shares" className={linkStyle('/shares')}>Sharing</Link>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center space-x-4">
                        {!token ? (
                            <>
                                <Link to="/login" className="text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors">Login</Link>
                                <Link to="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">Register</Link>
                            </>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                                    <UserCircle className="w-5 h-5" />
                                </div>
                                <button onClick={logout} className="flex items-center text-sm font-medium text-slate-500 hover:text-red-500 transition-colors">
                                    <LogOut className="w-4 h-4 mr-1" />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}