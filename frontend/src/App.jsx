import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Login from './pages/Login.jsx';
import StudentDashboard from './pages/StudentDashboard.jsx';
import FacultyDashboard from './pages/FacultyDashboard.jsx';

// Single source of truth for "where should this user go?"
function homeFor(user) {
  if (!user) return '/login';
  if (user.role === 'student' || user.role === 'faculty') return `/${user.role}`;
  return '/login';
}

function Protected({ role, children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to={homeFor(user)} replace />;
  return children;
}

export default function App() {
  const { user } = useAuth();
  const home = homeFor(user);

  return (
    <>
      <div className="orb orb-a" />
      <div className="orb orb-b" />
      <div className="orb orb-c" />

      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to={home} replace /> : <Login />}
        />
        <Route
          path="/student"
          element={
            <Protected role="student">
              <StudentDashboard />
            </Protected>
          }
        />
        <Route
          path="/faculty"
          element={
            <Protected role="faculty">
              <FacultyDashboard />
            </Protected>
          }
        />
        <Route path="*" element={<Navigate to={home} replace />} />
      </Routes>
    </>
  );
}