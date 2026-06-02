import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { UploadCloud, File, Image as ImageIcon, Send, X, ExternalLink } from 'lucide-react';
import api from '../api';

export default function Media() {
    const [mediaList, setMediaList] = useState([]);
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    
    // Share modal state
    const [shareModalOpen, setShareModalOpen] = useState(false);
    const [shareMediaLabel, setShareMediaLabel] = useState('');
    const [shareMediaId, setShareMediaId] = useState('');
    const [recipientEmail, setRecipientEmail] = useState('');

    const loadMedia = () => {
        api.get('/media/user/all')
            .then(res => setMediaList(res.data.data || []))
            .catch(e => console.error("Error loading media", e));
    };

    useEffect(() => {
        loadMedia();
    }, []);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return toast.error('Please select a file first.');
        
        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        try {
            await api.post('/media/upload', formData);
            toast.success('Uploaded successfully');
            setFile(null);
            loadMedia();
        } catch(err) {
            toast.error('Upload failed: ' + (err.response?.data?.message || err.message));
        } finally {
            setIsUploading(false);
        }
    };

    const openShareModal = (m) => {
        setShareMediaId(m.id);
        setShareMediaLabel(m.fileName);
        setRecipientEmail('');
        setShareModalOpen(true);
    }

    const handleShare = async (e) => {
        e.preventDefault();
        try {
            await api.post('/sharing/share', {
                mediaId: parseInt(shareMediaId),
                recipientEmail
            });
            toast.success('Shared successfully!');
            setShareModalOpen(false);
        } catch(err) {
            toast.error('Share failed: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleDownload = async (id, filename) => {
        try {
            const response = await api.get(`/media/download/${id}`, {
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
            toast.error('Download failed');
        }
    };

    const handleOpen = async (id) => {
        try {
            await api.get(`/media/open/${id}`);
            toast.success('Opening file in native application...');
        } catch (err) {
            toast.error('Could not open file natively');
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Media Library</h1>
                    <p className="text-slate-500 mt-1">Upload, view, and share your files.</p>
                </div>
            </div>

            {/* Dropzone */}
            <div className="bg-white border-2 border-dashed border-indigo-200 rounded-3xl p-8 hover:border-indigo-400 hover:bg-indigo-50/50 transition-colors">
                <form onSubmit={handleUpload} className="flex flex-col items-center text-center">
                    <div className="bg-indigo-100 p-4 rounded-full text-indigo-600 mb-4">
                        <UploadCloud className="w-8 h-8" />
                    </div>
                    <label className="block mb-2 text-lg font-medium text-slate-700 cursor-pointer">
                        Drag & Drop files here, or <span className="text-indigo-600 underline">click to browse</span>
                        <input type="file" className="hidden" onChange={e => setFile(e.target.files[0])} />
                    </label>
                    <p className="text-sm text-slate-400 mb-6">{file ? `Selected: ${file.name}` : "Support for images and documents up to 50MB."}</p>
                    
                    <button 
                        type="submit" 
                        disabled={!file || isUploading}
                        className={`px-8 py-3 rounded-xl font-semibold text-white transition-all
                            ${!file || isUploading ? 'bg-slate-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-sm'}`}
                    >
                        {isUploading ? 'Uploading...' : 'Upload File'}
                    </button>
                </form>
            </div>

            {/* Media Grid */}
            <div>
                <h3 className="text-xl font-bold text-slate-800 mb-4">Your Files</h3>
                {mediaList.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 text-slate-500">
                        <File className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                        No media files yet. Upload something above!
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {mediaList.map(m => (
                            <div key={m.id} className="group relative bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-lg transition-all overflow-hidden flex flex-col items-center">
                                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center backdrop-blur-[2px] space-y-2">
                                    <button onClick={() => openShareModal(m)} className="bg-indigo-600 text-white px-4 py-2 rounded-full font-medium shadow-lg hover:bg-indigo-500 flex items-center transform translate-y-4 group-hover:translate-y-0 transition-all w-28 justify-center">
                                        <Send className="w-4 h-4 mr-2"/> Share
                                    </button>
                                    <button onClick={() => handleOpen(m.id)} className="bg-white text-slate-900 px-4 py-2 rounded-full font-medium shadow-lg hover:bg-slate-100 flex items-center transform translate-y-4 group-hover:translate-y-0 transition-all w-28 justify-center">
                                        <ExternalLink className="w-4 h-4 mr-2"/> Open
                                    </button>
                                </div>
                                <div className="h-24 w-24 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 text-slate-400">
                                    {m.contentType?.includes('image') ? <ImageIcon className="w-10 h-10"/> : <File className="w-10 h-10"/>}
                                </div>
                                <h4 className="font-semibold text-slate-800 truncate w-full text-center" title={m.fileName}>{m.fileName}</h4>
                                <span className="text-xs text-slate-400 mt-1 uppercase tracking-wider">{m.contentType}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Share Modal */}
            {shareModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in p-4">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95">
                        <div className="flex justify-between items-center p-6 border-b border-slate-100">
                            <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">Share File</h3>
                            <button onClick={() => setShareModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full p-1 transition-colors">
                                <X className="w-5 h-5"/>
                            </button>
                        </div>
                        <form onSubmit={handleShare} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">File</label>
                                <div className="px-4 py-3 bg-slate-50 rounded-xl text-slate-600 text-sm font-semibold truncate border border-slate-200">
                                    {shareMediaLabel}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Recipient Email</label>
                                <input 
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                                    type="email" 
                                    placeholder="colleague@company.com" 
                                    value={recipientEmail} 
                                    onChange={e=>setRecipientEmail(e.target.value)} 
                                    required 
                                />
                            </div>
                            <div className="pt-2">
                                <button type="submit" className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:bg-indigo-700 active:scale-[0.98] transition-all flex justify-center items-center">
                                    <Send className="w-4 h-4 mr-2"/> Send Share Link
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}