import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { Ticket, Mail, Lock, AlertCircle } from 'lucide-react';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const doLogin = async (em, pw) => {
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/api/auth/login', {
        email: em,
        password: pw
      });
      localStorage.setItem('user', JSON.stringify(data));
      navigate(data.role === 'Admin' ? '/admin' : '/employee');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    doLogin(email, password);
  };

  return (
    <div className="login-page">
      <div className="login-card card">
        <div className="login-brand">
          <Ticket size={20} />
          <span>DeskFlow</span>
        </div>
        <h1>Sign in</h1>
        <p className="subtitle">Access your IT service dashboard</p>

        {error && (
          <div className="error-banner">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <div className="input-wrap">
            <Mail size={16} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@deskflow.com"
              required
            />
          </div>

          <label>Password</label>
          <div className="input-wrap">
            <Lock size={16} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className="quick-login">
          <p className="section-label">Quick test access</p>
          <div className="quick-buttons">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => doLogin('emp1@deskflow.com', 'emp1234')}
            >
              Login as Employee
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => doLogin('admin@deskflow.com', 'admin1234')}
            >
              Login as Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
