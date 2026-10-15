import { useEffect, useState } from 'react';
import api, { errorMessage } from '../api';
import Navbar from '../components/Navbar.jsx';
import StarRating from '../components/StarRating.jsx';

const empty = { facultyId: '', rating: 0, comments: '' };

export default function StudentDashboard() {
  const [faculty, setFaculty] = useState([]);
  const [mine, setMine] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [busy, setBusy] = useState(false);

  const load = async () => {
    try {
      const [f, m] = await Promise.all([api.get('/faculty'), api.get('/feedback/mine')]);
      setFaculty(f.data);
      setMine(m.data);
    } catch (err) {
      setError(errorMessage(err));
    }
  };
  useEffect(() => { load(); }, []);

  const flash = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!editingId && !form.facultyId) return setError('Select a faculty member.');
    if (!form.rating) return setError('Choose a rating from 1 to 5 stars.');
    if (form.comments.trim().length < 3) return setError('Write at least 3 characters of comments.');

    try {
      setBusy(true);
      if (editingId) {
        await api.put(`/feedback/${editingId}`, { rating: form.rating, comments: form.comments });
        flash('Feedback updated');
      } else {
        await api.post('/feedback', form);
        flash('Feedback submitted');
      }
      setForm(empty);
      setEditingId(null);
      await load();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const edit = (f) => {
    setEditingId(f._id);
    setForm({ facultyId: f.facultyId, rating: f.rating, comments: f.comments });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => { setEditingId(null); setForm(empty); setError(''); };

  const remove = async (id) => {
    if (!window.confirm('Delete this feedback?')) return;
    try {
      await api.delete(`/feedback/${id}`);
      flash('Feedback deleted');
      if (editingId === id) cancelEdit();
      await load();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  return (
    <div className="page">
      <Navbar title="Student dashboard" />

      <div className="grid-2">
        <form className="glass card" onSubmit={submit} noValidate>
          <h2>{editingId ? 'Edit your feedback' : 'Give feedback'}</h2>

          <label>
            Faculty member
            <select value={form.facultyId} disabled={!!editingId} onChange={(e) => setForm({ ...form, facultyId: e.target.value })}>
              <option value="">Select faculty…</option>
              {faculty.map((f) => (
                <option key={f.facultyId} value={f.facultyId}>{f.facultyName}</option>
              ))}
            </select>
          </label>

          <div className="field">
            <span>Rating</span>
            <StarRating value={form.rating} onChange={(rating) => setForm({ ...form, rating })} />
          </div>

          <label>
            Comments
            <textarea rows="5" maxLength="500" value={form.comments} onChange={(e) => setForm({ ...form, comments: e.target.value })} placeholder="What went well? What could improve?" />
            <small className="muted">{form.comments.length}/500</small>
          </label>

          {error && <div className="alert" role="alert">{error}</div>}

          <div className="row">
            <button className="btn" disabled={busy}>{editingId ? 'Save changes' : 'Submit feedback'}</button>
            {editingId && <button type="button" className="btn btn-ghost" onClick={cancelEdit}>Cancel</button>}
          </div>
        </form>

        <section className="glass card">
          <h2>Your feedback ({mine.length})</h2>
          {mine.length === 0 && <p className="muted empty">You haven't submitted any feedback yet. Use the form to send your first.</p>}
          <ul className="list">
            {mine.map((f) => (
              <li key={f._id} className="item">
                <div className="item-top">
                  <strong>{f.facultyName}</strong>
                  <StarRating value={f.rating} readOnly />
                </div>
                <p>{f.comments}</p>
                <div className="item-bottom">
                  <span className="muted">{new Date(f.createdAt).toLocaleDateString()}</span>
                  <span className="row">
                    <button className="btn btn-sm btn-ghost" onClick={() => edit(f)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => remove(f._id)}>Delete</button>
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}
