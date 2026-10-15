import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar({ title }) {
  const { user, logout } = useAuth();
  return (
    <header className="glass nav">
      <div>
        <h1>{title}</h1>
        <p className="muted">
          {user.name} · {user.role === 'student' ? 'Student' : 'Faculty'} ID {user.id}
        </p>
      </div>
      <button className="btn btn-ghost" onClick={logout}>Log out</button>
    </header>
  );
}
