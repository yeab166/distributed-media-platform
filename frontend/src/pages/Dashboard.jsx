import { useState, useEffect } from 'react';
import { Activity, HardDrive, Share2, Users } from 'lucide-react';
import api from '../api';

export default function Dashboard() {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        api.get('/users/profile')
            .then(res => setProfile(res.data.data))
            .catch(err => setError("Could not load profile. Please make sure you are logged in."));
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center">
                    <Activity className="w-5 h-5 mr-2" /> {error}
                </div>
            )}
            
            {profile ? (
                <>
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl p-8 sm:p-12 text-white shadow-lg overflow-hidden relative">
                        <div className="relative z-10">
                            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Welcome back, {profile.username} 👋</h1>
                            <p className="text-blue-100 text-lg">{profile.email}</p>
                        </div>
                        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-12 translate-y-12">
                            <CloudDecoration />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <StatCard icon={<HardDrive className="text-blue-500 w-6 h-6"/>} title="Storage Used" value="12 MB" trend="+2 files this week" />
                        <StatCard icon={<Share2 className="text-emerald-500 w-6 h-6"/>} title="Active Shares" value="4 Links" trend="2 viewed recently" />
                        <StatCard icon={<Users className="text-purple-500 w-6 h-6"/>} title="Shared With Me" value="1 Item" trend="From admin@org" />
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                            <Activity className="w-5 h-5 mr-2 text-slate-400" /> Recent Activity
                        </h2>
                        <div className="text-center py-10 text-slate-500">
                            No recent activity found. Head over to the Media Library to upload some files!
                        </div>
                    </div>
                </>
            ) : (
                !error && (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                )
            )}
        </div>
    );
}

function StatCard({ icon, title, value, trend }) {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center">
                    {icon}
                </div>
            </div>
            <div>
                <h3 className="text-sm font-medium text-slate-500 mb-1">{title}</h3>
                <div className="text-2xl font-bold text-slate-900">{value}</div>
            </div>
            <div className="mt-4 text-xs font-medium text-slate-400 border-t border-slate-100 pt-4">
                {trend}
            </div>
        </div>
    );
}

function CloudDecoration() {
    return (
        <svg width="200" height="200" viewBox="0 0 24 24" fill="currentColor">
             <path d="M17.5 19C19.9853 19 22 16.9853 22 14.5C22 12.1325 20.1784 10.1904 17.8596 10.0229C17.5367 6.64364 14.6983 4 11.25 4C7.38401 4 4.25 7.13401 4.25 11C4.25 11.3912 4.2821 11.775 4.34316 12.1482C2.45781 12.5694 1 14.3644 1 16.5C1 18.9853 3.01472 21 5.5 21H17.5V19Z" />
        </svg>
    )
}