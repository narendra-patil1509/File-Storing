import { useState, useEffect, useRef } from 'react';
import api from '../api';
import { UploadCloud, Trash2, Download, Edit2, File as FileIcon, Image as ImageIcon, Check, X } from 'lucide-react';
import clsx from 'clsx';

export default function MyFiles() {
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');
  const [renaming, setRenaming] = useState(null);
  const [newName, setNewName] = useState('');
  const fileInputRef = useRef(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const fetchFiles = async () => {
    try {
      const res = await api.get('/files');
      setFiles(res.data);
    } catch(err) {
      showToast('Error fetching files');
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await uploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = async (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      await uploadFile(e.target.files[0]);
    }
  };

  const uploadFile = async (file) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      showToast('File uploaded successfully!');
      fetchFiles();
    } catch (err) {
      showToast('Upload failed');
    } finally {
      setLoading(false);
      if(fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (filename) => {
    if (!window.confirm('Delete this file?')) return;
    try {
      await api.delete(`/files/${filename}`);
      showToast('File deleted');
      fetchFiles();
    } catch (err) {
      showToast('Deletion failed');
    }
  };

  const handleRename = async (oldName) => {
    if (!newName.trim() || newName === oldName) {
      setRenaming(null);
      return;
    }
    try {
      await api.put('/files/rename', { oldName, newName });
      showToast('File renamed');
      setRenaming(null);
      fetchFiles();
    } catch (err) {
      showToast('Rename failed');
    }
  };

  const handleDownload = async (filename) => {
    try {
      const res = await api.get(`/files/download/${filename}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      showToast('Download failed');
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024, dm = 2, sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const isImage = (name) => /\.(jpg|jpeg|png|gif|webp)$/i.test(name);

  return (
    <div className="w-full h-full text-solar-text animate-fade-in relative">
      {toast && (
        <div className="absolute top-0 right-0 m-4 px-4 py-3 bg-solar-surfaceHighlight border border-solar-cyan text-solar-textBright font-medium rounded shadow-xl z-50">
          {toast}
        </div>
      )}
      
      <h1 className="text-3xl font-bold text-solar-textBright mb-6">My Files</h1>
      
      <div 
        className={clsx(
          "w-full h-48 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center mb-8 transition-colors cursor-pointer",
          dragActive ? "border-solar-cyan bg-solar-cyan/5" : "border-solar-surfaceHighlight bg-solar-surface hover:border-solar-cyan hover:bg-solar-surface/80"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
      >
        <UploadCloud size={48} className={dragActive ? "text-solar-cyan" : "text-solar-textMuted"} />
        <p className="mt-4 text-solar-textBright font-medium">Drag & Drop files here</p>
        <p className="text-sm text-solar-textMuted mt-1">or click to browse</p>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          onChange={handleChange}
        />
        {loading && <p className="mt-2 text-sm text-solar-cyan animate-pulse">Uploading...</p>}
      </div>

      <div className="bg-solar-surface border border-solar-surfaceHighlight rounded-2xl overflow-hidden shadow-lg shadow-black/10">
        {files.length === 0 ? (
          <div className="p-8 text-center text-solar-textMuted">No files uploaded yet.</div>
        ) : (
          <ul className="divide-y divide-solar-surfaceHighlight">
            {files.map((file) => (
              <li key={file.name} className="p-4 flex items-center justify-between hover:bg-solar-base transition-colors group">
                <div className="flex items-center gap-4 flex-1 overflow-hidden">
                  <div className="p-3 bg-solar-base border border-solar-surfaceHighlight rounded-xl text-solar-cyan">
                    {isImage(file.name) ? <ImageIcon size={20} /> : <FileIcon size={20} />}
                  </div>
                  {renaming === file.name ? (
                    <div className="flex items-center gap-2 flex-1">
                      <input 
                        type="text" 
                        value={newName} 
                        onChange={e => setNewName(e.target.value)}
                        className="bg-solar-base border border-solar-cyan px-3 py-2 rounded-lg text-solar-textBright w-full max-w-xs focus:outline-none"
                        autoFocus
                      />
                      <button onClick={() => handleRename(file.name)} className="text-solar-green p-2 shrink-0 hover:bg-solar-green/10 rounded-lg"><Check size={18} /></button>
                      <button onClick={() => setRenaming(null)} className="text-solar-red p-2 shrink-0 hover:bg-solar-red/10 rounded-lg"><X size={18} /></button>
                    </div>
                  ) : (
                    <div className="flex flex-col flex-1 truncate pr-4">
                      <span className="font-medium text-solar-textBright truncate">{file.name}</span>
                      <span className="text-xs text-solar-textMuted mt-1">{formatBytes(file.size)} • {new Date(file.createdAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
                
                {!renaming && (
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleDownload(file.name)} className="p-2 text-solar-blue hover:bg-solar-blue/10 rounded-lg transition-colors" title="Download">
                      <Download size={18} />
                    </button>
                    <button onClick={() => { setRenaming(file.name); setNewName(file.name); }} className="p-2 text-solar-yellow hover:bg-solar-yellow/10 rounded-lg transition-colors" title="Rename">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(file.name)} className="p-2 text-solar-red hover:bg-solar-red/10 rounded-lg transition-colors" title="Delete">
                      <Trash2 size={18} />
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
