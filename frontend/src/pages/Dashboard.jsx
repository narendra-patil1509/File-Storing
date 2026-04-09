import { useState, useEffect } from 'react';
import api from '../api';
import { HardDrive, FileText, UploadCloud } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [stats, setStats] = useState({ files: 0, notes: 0, storage: 0 });
  const [user, setUser] = useState(null);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('user'));
    setUser(u);

    const fetchData = async () => {
      try {
        const [filesRes, notesRes] = await Promise.all([
          api.get('/files'),
          api.get('/notes')
        ]);
        
        const filesCount = filesRes.data.length;
        const storageUsage = filesRes.data.reduce((acc, f) => acc + f.size, 0);
        const notesCount = notesRes.data.length;

        setStats({ files: filesCount, notes: notesCount, storage: storageUsage });
      } catch(err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024, dm = 2, sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full h-full text-solar-text animate-fade-in">
      <h1 className="text-3xl font-bold text-solar-textBright mb-2">Welcome, {user?.username}</h1>
      <p className="text-solar-textMuted mb-8">Here is an overview of your vault.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-solar-surface p-6 rounded-2xl border border-solar-surfaceHighlight flex items-center gap-4 hover:border-solar-cyan/50 transition-colors">
          <div className="p-4 bg-solar-base rounded-xl text-solar-blue">
            <HardDrive size={24} />
          </div>
          <div>
            <p className="text-sm text-solar-textMuted">Total Files</p>
            <p className="text-2xl font-bold text-solar-textBright">{stats.files}</p>
          </div>
        </div>
        <div className="bg-solar-surface p-6 rounded-2xl border border-solar-surfaceHighlight flex items-center gap-4 hover:border-solar-magenta/50 transition-colors">
          <div className="p-4 bg-solar-base rounded-xl text-solar-magenta">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-sm text-solar-textMuted">Total Notes</p>
            <p className="text-2xl font-bold text-solar-textBright">{stats.notes}</p>
          </div>
        </div>
        <div className="bg-solar-surface p-6 rounded-2xl border border-solar-surfaceHighlight flex items-center gap-4 hover:border-solar-green/50 transition-colors">
          <div className="p-4 bg-solar-base rounded-xl text-solar-green">
            <UploadCloud size={24} />
          </div>
          <div>
            <p className="text-sm text-solar-textMuted">Storage Used</p>
            <p className="text-2xl font-bold text-solar-textBright">{formatBytes(stats.storage)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-solar-surface border border-solar-surfaceHighlight rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-solar-textBright mb-4 border-b border-solar-surfaceHighlight pb-2">Quick Actions</h2>
          <div className="flex gap-4">
            <Link to="/files" className="flex-1 py-3 bg-solar-base border border-solar-surfaceHighlight hover:border-solar-cyan text-center rounded-xl transition-all hover:bg-solar-base/50 text-solar-cyan text-sm font-medium">Upload File</Link>
            <Link to="/notes" className="flex-1 py-3 bg-solar-base border border-solar-surfaceHighlight hover:border-solar-magenta text-center rounded-xl transition-all hover:bg-solar-base/50 text-solar-magenta text-sm font-medium">Create Note</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
