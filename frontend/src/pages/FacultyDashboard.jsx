import { useEffect, useMemo, useState } from 'react';
import api, { errorMessage } from '../api';
import Navbar from '../components/Navbar.jsx';
import StarRating from '../components/StarRating.jsx';

export default function FacultyDashboard() {
  const [feedback, setFeedback] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Debounced search: waits 350ms after typing stops, then asks the API
  useEffect(() => {
    const t = setTimeout(async () => {
      try {
        setLoading(true);
        setError('');
        const { data } = await api.get('/feedback', { params: { student: search } });
        setFeedback(data);
      } catch (err) {
        setError(errorMessage(err));
      } finally {
        setLoading(false);
      }
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  const average = useMemo(
    () => (feedback.length ? (feedback.reduce((s, f) => s + f.rating, 0) / feedback.length).toFixed(1) : '–'),
    [feedback]
  );

  return (
    <div className="page">
      <Navbar title="Faculty dashboard" />

      <section className="stats">
        <div className="glass stat">
          <span className="muted">Feedback shown</span>
          <strong>{feedback.length}</strong>
        </div>
        <div className="glass stat">
          <span className="muted">Average rating</span>
          <strong>{average}</strong>
        </div>
      </section>

      <section className="glass card">
        <div className="toolbar">
          <h2>All feedback</h2>
          <input className="search" type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by student name…" aria-label="Search feedback by student name" />
        </div>

        {error && <div className="alert" role="alert">{error}</div>}
        {loading && <p className="muted">Loading…</p>}
        {!loading && !error && feedback.length === 0 && (
          <p className="muted empty">{search ? `No feedback from a student named "${search}".` : 'No feedback has been submitted yet.'}</p>
        )}

        <ul className="list cols">
          {feedback.map((f) => (
            <li key={f._id} className="item">
              <div className="item-top">
                <div>
                  <strong>{f.studentName}</strong>
                  <span className="muted"> · {f.studentId}</span>
                </div>
                <StarRating value={f.rating} readOnly />
              </div>
              <p>{f.comments}</p>
              <div className="item-bottom">
                <span className="chip">For {f.facultyName}</span>
                <span className="muted">{new Date(f.createdAt).toLocaleDateString()}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
