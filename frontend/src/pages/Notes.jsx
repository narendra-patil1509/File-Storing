import { useState, useEffect } from 'react';
import api from '../api';
import { Edit3, Trash2, Plus, Clock, ArrowLeft } from 'lucide-react';
import clsx from 'clsx';

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [toast, setToast] = useState('');
  const [activeNote, setActiveNote] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '' });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const fetchNotes = async () => {
    try {
      const res = await api.get('/notes');
      setNotes(res.data);
    } catch(err) {
      showToast('Error fetching notes');
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleSave = async () => {
    if (!formData.title.trim()) return showToast('Title is required');
    try {
      if (activeNote && activeNote.id) {
        await api.put(`/notes/${activeNote.id}`, formData);
        showToast('Note updated');
      } else {
        await api.post('/notes', formData);
        showToast('Note created');
      }
      setActiveNote(null);
      setFormData({ title: '', content: '' });
      fetchNotes();
    } catch (err) {
      showToast('Failed to save note');
    }
  };

  const handleDelete = async (id, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm('Delete this note?')) return;
    try {
      await api.delete(`/notes/${id}`);
      showToast('Note deleted');
      if (activeNote?.id === id) {
        setActiveNote(null);
        setFormData({ title: '', content: '' });
      }
      fetchNotes();
    } catch (err) {
      showToast('Deletion failed');
    }
  };

  const openNote = (note) => {
    setActiveNote(note);
    setFormData({ title: note.title, content: note.content });
  };

  const createNewNote = () => {
    setActiveNote({ id: null });
    setFormData({ title: '', content: '' });
  };

  return (
    <div className="w-full h-full flex flex-col md:flex-row gap-6 text-solar-text animate-fade-in relative z-0">
      {toast && (
        <div className="absolute top-0 right-0 m-4 px-4 py-3 bg-solar-surfaceHighlight border border-solar-cyan text-solar-textBright font-medium rounded shadow-xl z-50">
          {toast}
        </div>
      )}

      <div className={clsx("w-full md:w-1/3 flex-col bg-solar-surface rounded-2xl border border-solar-surfaceHighlight shadow-lg overflow-hidden h-[calc(100vh-6rem)] md:h-[calc(100vh-4rem)]", activeNote ? "hidden md:flex" : "flex")}>
        <div className="p-4 border-b border-solar-surfaceHighlight flex justify-between items-center bg-solar-base/30">
          <h2 className="text-lg font-bold text-solar-textBright">Your Notes</h2>
          <button onClick={createNewNote} className="p-2 bg-solar-cyan text-solar-base rounded-lg hover:bg-solar-cyan/90 transition-colors">
            <Plus size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {notes.length === 0 ? (
            <p className="text-center text-solar-textMuted mt-10">No notes found.</p>
          ) : (
            notes.map(note => (
              <div 
                key={note.id} 
                onClick={() => openNote(note)}
                className={`p-4 rounded-xl cursor-pointer border transition-all ${activeNote?.id === note.id ? 'bg-solar-surfaceHighlight border-solar-cyan' : 'bg-solar-base border-transparent hover:border-solar-surfaceHighlight'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-solar-textBright truncate pr-2">{note.title}</h3>
                  <button onClick={(e) => handleDelete(note.id, e)} className="text-solar-textMuted hover:text-solar-red transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
                <p className="text-sm text-solar-textMuted line-clamp-2">{note.content || 'No content'}</p>
                <div className="mt-3 flex items-center gap-1 text-xs text-solar-textMuted/70">
                  <Clock size={12} />
                  <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className={clsx("w-full md:w-2/3 flex-col bg-solar-surface rounded-2xl border border-solar-surfaceHighlight shadow-lg overflow-hidden h-[calc(100vh-6rem)] md:h-[calc(100vh-4rem)]", !activeNote ? "hidden md:flex" : "flex")}>
        {activeNote ? (
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-solar-surfaceHighlight flex justify-between items-center bg-solar-base/30 gap-2">
              <button 
                onClick={() => setActiveNote(null)} 
                className="md:hidden p-2 text-solar-textMuted hover:text-solar-cyan rounded-lg transition-colors border border-solar-surfaceHighlight bg-solar-base/50 shrink-0"
              >
                <ArrowLeft size={18} />
              </button>
              <input 
                type="text" 
                value={formData.title} 
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="Note Title"
                className="bg-transparent text-xl font-bold text-solar-textBright focus:outline-none w-full mr-2 placeholder-solar-textMuted"
              />
              <button onClick={handleSave} className="px-4 py-2 bg-solar-cyan text-solar-base text-sm font-semibold rounded-lg hover:bg-solar-cyan/90 transition-colors whitespace-nowrap shrink-0">
                Save Note
              </button>
            </div>
            <textarea 
              value={formData.content}
              onChange={e => setFormData({ ...formData, content: e.target.value })}
              placeholder="Start typing your note here..."
              className="flex-1 w-full bg-transparent p-4 md:p-6 text-solar-text resize-none focus:outline-none placeholder-solar-textMuted/50 leading-relaxed"
            />
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-solar-textMuted p-4 text-center">
            <Edit3 size={48} className="mb-4 opacity-50" />
            <p className="text-lg">Select a note or create a new one to start writing.</p>
          </div>
        )}
      </div>
    </div>
  );
}
