import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { KeyRound, User } from 'lucide-react';
import api from '../api';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/login', { username, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-solar-base text-solar-text">
      <div className="w-full max-w-md p-8 bg-solar-surface rounded-2xl shadow-2xl border border-solar-surfaceHighlight">
        <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-solar-cyan to-solar-blue bg-clip-text text-transparent">Welcome Back</h2>
        {error && <div className="mb-4 p-3 bg-solar-red/10 border border-solar-red text-solar-red rounded-lg text-sm">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-6">
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
            Sign In
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-solar-textMuted">
          Don't have an account? <Link to="/register" className="text-solar-cyan hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
}
