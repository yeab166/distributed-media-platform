import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Copy, Link as LinkIcon, Trash2, ArrowRight, ExternalLink } from 'lucide-react';
import api from '../api';

export default function Shares() {
    const [activeTab, setActiveTab] = useState('sent');
    const [myShares, setMyShares] = useState([]);
    const [sharedWithMe, setSharedWithMe] = useState([]);

    useEffect(() => {
        api.get('/sharing/my-shares')
            .then(res => setMyShares(res.data.data || []))
            .catch(e => console.error(e));
        
        api.get('/sharing/shared-with-me')
            .then(res => setSharedWithMe(res.data.data || []))
            .catch(e => console.error(e));
    }, []);

    const copyToClipboard = (token) => {
        const url = `${window.location.origin}/token/${token}`;
        navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
    }

    const handleDownload = async (mediaId) => {
        try {
            // First get media details to get filename
            const mediaRes = await api.get(`/media/${mediaId}`);
            const filename = mediaRes.data.data.fileName;

            const response = await api.get(`/media/download/${mediaId}`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            toast.error('Could not open file');
        }
    };

    const TableCell = ({ children, isHeader = false }) => {
        const Tag = isHeader ? 'th' : 'td';
        return (
            <Tag className={`p-4 text-left ${isHeader ? 'bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200 rounded-t-lg' : 'border-b border-slate-100 text-sm text-slate-700 bg-white'}`}>
                {children}
            </Tag>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Sharing Center</h1>
                <p className="text-slate-500 mt-1">Manage links you've sent and files shared with you.</p>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-slate-200/50 p-1 rounded-xl w-fit">
                <button 
                    onClick={() => setActiveTab('sent')}
                    className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'sent' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                >
                    Sent by Me
                </button>
                <button 
                    onClick={() => setActiveTab('received')}
                    className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'received' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                >
                    Shared With Me
                </button>
            </div>

            {/* List Containers */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full whitespace-nowrap border-collapse">
                        <thead>
                            <tr>
                                <TableCell isHeader>Media ID</TableCell>
                                <TableCell isHeader>{activeTab === 'sent' ? 'Recipient' : 'Owner ID'}</TableCell>
                                <TableCell isHeader>Access Token</TableCell>
                                <TableCell isHeader>Date Shared</TableCell>
                                <TableCell isHeader>Actions</TableCell>
                            </tr>
                        </thead>
                        <tbody>
                            {(activeTab === 'sent' ? myShares : sharedWithMe).map((s, index) => (
                                <tr key={s.id} className="hover:bg-slate-50 transition-colors group">
                                    <TableCell>
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 font-bold">
                                                {s.mediaId}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-medium">
                                            {activeTab === 'sent' ? (s.targetUserId || "Email User") : s.ownerId}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-2">
                                            <code className="bg-slate-100 text-slate-500 px-2 py-1 rounded text-xs truncate max-w-[120px] inline-block">
                                                {s.shareToken}
                                            </code>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-slate-500">
                                            {new Date(s.createdAt).toLocaleDateString()}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-2">
                                            <button 
                                                onClick={() => handleDownload(s.mediaId)}
                                                className="text-slate-400 hover:text-green-600 font-medium p-2 rounded-lg hover:bg-green-50 transition-colors"
                                                title="Open File"
                                            >
                                                <ExternalLink className="w-4 h-4"/>
                                            </button>
                                            <button 
                                                onClick={() => copyToClipboard(s.shareToken)}
                                                className="text-slate-400 hover:text-indigo-600 font-medium p-2 rounded-lg hover:bg-indigo-50 transition-colors"
                                                title="Copy Link"
                                            >
                                                <Copy className="w-4 h-4"/>
                                            </button>
                                            {activeTab === 'sent' && (
                                                <button className="text-slate-400 hover:text-red-600 font-medium p-2 rounded-lg hover:bg-red-50 transition-colors" title="Revoke Access">
                                                    <Trash2 className="w-4 h-4"/>
                                                </button>
                                            )}
                                        </div>
                                    </TableCell>
                                </tr>
                            ))}
                            {(activeTab === 'sent' ? myShares : sharedWithMe).length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-12 text-center text-slate-400">
                                        <div className="flex flex-col items-center justify-center">
                                            <ArrowRight className="w-8 h-8 opacity-20 mb-3" />
                                            {activeTab === 'sent' ? "You haven't shared anything yet." : "Nobody has shared files with you."}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}