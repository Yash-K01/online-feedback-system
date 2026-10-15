import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { errorMessage } from '../api';

export default function Login() {
  const { authenticate } = useAuth();
  const [role, setRole] = useState('student');
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ id: '', name: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.id.trim() || !form.password) return setError('Enter your ID and password.');
    if (mode === 'register' && !form.name.trim()) return setError('Enter your name.');

    const payload =
      role === 'student'
        ? { studentId: form.id.trim(), name: form.name.trim(), password: form.password }
        : { facultyId: form.id.trim(), facultyName: form.name.trim(), password: form.password };
    if (mode === 'login') {
      delete payload.name;
      delete payload.facultyName;
    }

    try {
      setBusy(true);
      await authenticate(role, mode, payload);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const label = role === 'student' ? 'Student' : 'Faculty';

  return (
    <main className="center">
      <form className="glass card auth" onSubmit={submit} noValidate>
        <h1>Online Feedback System</h1>
        <p className="muted">Share feedback with your faculty, or review what students have said.</p>

        <div className="segmented" role="tablist">
          {['student', 'faculty'].map((r) => (
            <button type="button" key={r} className={role === r ? 'seg active' : 'seg'} onClick={() => { setRole(r); setError(''); }}>
              {r === 'student' ? 'Student' : 'Faculty'}
            </button>
          ))}
        </div>

        <label>
          {label} ID
          <input value={form.id} onChange={set('id')} placeholder={role === 'student' ? 'e.g. S001' : 'e.g. F001'} autoComplete="username" />
        </label>

        {mode === 'register' && (
          <label>
            Full name
            <input value={form.name} onChange={set('name')} placeholder="Your name" />
          </label>
        )}

        <label>
          Password
          <input type="password" value={form.password} onChange={set('password')} placeholder="At least 6 characters" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />
        </label>

        {error && <div className="alert" role="alert">{error}</div>}

        <button className="btn" disabled={busy}>
          {busy ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create account'}
        </button>

        <p className="switch muted">
          {mode === 'login' ? 'New here?' : 'Already registered?'}{' '}
          <button type="button" className="link" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}>
            {mode === 'login' ? 'Create an account' : 'Log in'}
          </button>
        </p>

        <p className="hint muted">Demo after seeding: S001 / student123 · F001 / faculty123</p>
      </form>
    </main>
  );
}
