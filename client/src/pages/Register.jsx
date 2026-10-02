import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthCard from '../components/AuthCard';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../services/api';

const PASSWORD_RX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

function validate(f) {
  const errors = {};
  if (f.name.trim().length < 2) errors.name = 'Enter your full name (at least 2 characters).';
  if (!/^\S+@\S+\.\S+$/.test(f.email)) errors.email = 'Enter a valid email address.';
  if (!/^\+?\d{10,13}$/.test(f.phone)) errors.phone = 'Enter a valid phone number (10 to 13 digits).';
  if (!PASSWORD_RX.test(f.password)) errors.password = 'Use 8+ characters with upper-case, lower-case and a number.';
  if (f.password !== f.confirmPassword) errors.confirmPassword = 'Passwords do not match.';
  return errors;
}

export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setServerError('');
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) return;
    setBusy(true);
    try {
      const { confirmPassword, ...payload } = form; // eslint-disable-line no-unused-vars
      await register(payload);
      toast.success('Account created. You start with ₹1,00,000 virtual funds.');
      navigate('/dashboard');
    } catch (err) {
      setServerError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const field = (name, label, type = 'text', autoComplete) => (
    <div className="mb-3">
      <label className="form-label small">{label}</label>
      <input
        type={type} autoComplete={autoComplete}
        className={`form-control ${errors[name] ? 'is-invalid' : ''}`}
        value={form[name]} onChange={(e) => setForm({ ...form, [name]: e.target.value })}
      />
      {errors[name] && <div className="invalid-feedback">{errors[name]}</div>}
    </div>
  );

  return (
    <AuthCard
      title="Create your account"
      subtitle="Start paper trading with ₹1,00,000 virtual funds"
      footer={<>Already registered? <Link to="/login">Log in</Link></>}
    >
      <form onSubmit={submit} noValidate>
        {serverError && <div className="alert alert-danger py-2 small">{serverError}</div>}
        {field('name', 'Full name', 'text', 'name')}
        {field('email', 'Email', 'email', 'email')}
        {field('phone', 'Phone number', 'tel', 'tel')}
        {field('password', 'Password', 'password', 'new-password')}
        {field('confirmPassword', 'Confirm password', 'password', 'new-password')}
        <button className="btn btn-primary w-100" disabled={busy}>{busy ? 'Creating account...' : 'Create account'}</button>
      </form>
    </AuthCard>
  );
}
