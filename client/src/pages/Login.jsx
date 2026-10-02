import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthCard from '../components/AuthCard';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../services/api';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '', remember: true });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError('Enter a valid email address.');
    if (!form.password) return setError('Password is required.');
    setBusy(true);
    try {
      await login(form.email, form.password, form.remember);
      toast.success('Welcome back!');
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthCard
      title="Log in to TradeX"
      subtitle="Continue to your paper-trading dashboard"
      footer={<>New here? <Link to="/register">Create an account</Link></>}
    >
      <form onSubmit={submit} noValidate>
        {error && <div className="alert alert-danger py-2 small">{error}</div>}
        <div className="mb-3">
          <label className="form-label small">Email</label>
          <input type="email" className="form-control" value={form.email} onChange={set('email')} autoComplete="email" />
        </div>
        <div className="mb-3">
          <label className="form-label small">Password</label>
          <input type="password" className="form-control" value={form.password} onChange={set('password')} autoComplete="current-password" />
        </div>
        <div className="form-check mb-3">
          <input id="remember" type="checkbox" className="form-check-input" checked={form.remember} onChange={set('remember')} />
          <label htmlFor="remember" className="form-check-label small">Keep me logged in</label>
        </div>
        <button className="btn btn-primary w-100" disabled={busy}>{busy ? 'Logging in...' : 'Log in'}</button>
        <button type="button" className="btn btn-link btn-sm w-100 mt-2" onClick={() => setForm({ ...form, email: 'demo@tradex.com', password: 'Demo@12345' })}>
          Fill demo account
        </button>
      </form>
    </AuthCard>
  );
}
