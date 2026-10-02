import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { updateProfile, changePassword } from '../services/tradingService';
import { getErrorMessage } from '../services/api';

const PASSWORD_RX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export default function Profile() {
  const { user, setUser } = useAuth();
  const [info, setInfo] = useState({ name: user.name, phone: user.phone });
  const [pw, setPw] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [busy, setBusy] = useState('');

  const saveInfo = async (e) => {
    e.preventDefault();
    if (info.name.trim().length < 2) return toast.error('Name must be at least 2 characters.');
    if (!/^\+?\d{10,13}$/.test(info.phone)) return toast.error('Enter a valid phone number.');
    setBusy('info');
    try {
      const res = await updateProfile(info);
      setUser(res.user);
      toast.success(res.message);
    } catch (err) { toast.error(getErrorMessage(err)); }
    finally { setBusy(''); }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    if (!pw.currentPassword) return toast.error('Enter your current password.');
    if (!PASSWORD_RX.test(pw.newPassword)) return toast.error('New password needs 8+ characters with upper-case, lower-case and a number.');
    if (pw.newPassword !== pw.confirm) return toast.error('New passwords do not match.');
    setBusy('pw');
    try {
      const res = await changePassword({ currentPassword: pw.currentPassword, newPassword: pw.newPassword });
      toast.success(res.message);
      setPw({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) { toast.error(getErrorMessage(err)); }
    finally { setBusy(''); }
  };

  return (
    <div className="d-flex flex-column gap-3" style={{ maxWidth: 720 }}>
      <h4 className="fw-bold mb-0">Profile</h4>
      <div className="tx-card tx-card-body">
        <div className="row g-3 mb-2">
          <div className="col-md-6"><div className="stat-label">Email</div><div className="fw-semibold">{user.email}</div></div>
          <div className="col-md-6"><div className="stat-label">Member since</div><div className="fw-semibold">{new Date(user.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</div></div>
        </div>
      </div>
      <form className="tx-card tx-card-body" onSubmit={saveInfo}>
        <h6 className="fw-bold">Personal details</h6>
        <div className="row g-3">
          <div className="col-md-6"><label className="form-label small">Full name</label><input className="form-control" value={info.name} onChange={(e) => setInfo({ ...info, name: e.target.value })} /></div>
          <div className="col-md-6"><label className="form-label small">Phone</label><input className="form-control" value={info.phone} onChange={(e) => setInfo({ ...info, phone: e.target.value })} /></div>
        </div>
        <button className="btn btn-primary mt-3" disabled={busy === 'info'}>{busy === 'info' ? 'Saving...' : 'Save changes'}</button>
      </form>
      <form className="tx-card tx-card-body" onSubmit={savePassword}>
        <h6 className="fw-bold">Change password</h6>
        <div className="row g-3">
          <div className="col-md-4"><label className="form-label small">Current password</label><input type="password" className="form-control" autoComplete="current-password" value={pw.currentPassword} onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })} /></div>
          <div className="col-md-4"><label className="form-label small">New password</label><input type="password" className="form-control" autoComplete="new-password" value={pw.newPassword} onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} /></div>
          <div className="col-md-4"><label className="form-label small">Confirm new password</label><input type="password" className="form-control" autoComplete="new-password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} /></div>
        </div>
        <button className="btn btn-primary mt-3" disabled={busy === 'pw'}>{busy === 'pw' ? 'Updating...' : 'Update password'}</button>
      </form>
    </div>
  );
}
