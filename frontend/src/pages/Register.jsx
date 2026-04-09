import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { KeyRound, User } from 'lucide-react';
import api from '../api';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post('/register', { username, password });
      setSuccess(true);
      setError('');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-solar-base text-solar-text">
      <div className="w-full max-w-md p-8 bg-solar-surface rounded-2xl shadow-2xl border border-solar-surfaceHighlight">
        <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-solar-magenta to-solar-cyan bg-clip-text text-transparent">Create Account</h2>
        {error && <div className="mb-4 p-3 bg-solar-red/10 border border-solar-red text-solar-red rounded-lg text-sm">{error}</div>}
        {success && <div className="mb-4 p-3 bg-solar-green/10 border border-solar-green text-solar-green rounded-lg text-sm">Account created successfully. Redirecting...</div>}
        
        <form onSubmit={handleRegister} className="space-y-6">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-solar-textMuted" size={18} />
            <input 
              type="text" 
              placeholder="Username" 
              className="w-full pl-10 pr-4 py-3 bg-solar-base border border-solar-surfaceHighlight rounded-lg text-solar-textBright placeholder-solar-textMuted focus:outline-none focus:border-solar-cyan focus:ring-1 focus:ring-solar-cyan transition-all"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-solar-textMuted" size={18} />
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full pl-10 pr-4 py-3 bg-solar-base border border-solar-surfaceHighlight rounded-lg text-solar-textBright placeholder-solar-textMuted focus:outline-none focus:border-solar-cyan focus:ring-1 focus:ring-solar-cyan transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="w-full py-3 bg-solar-cyan hover:bg-solar-cyan/90 text-solar-base font-semibold rounded-lg shadow-lg hover:shadow-solar-cyan/20 transition-all active:scale-[0.98]">
            Sign Up
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-solar-textMuted">
          Already have an account? <Link to="/login" className="text-solar-cyan hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
