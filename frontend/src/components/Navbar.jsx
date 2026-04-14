import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Logo size={32} />
        <span className="brand-text">UserMS</span>
      </div>
      <div className="navbar-links">
        <Link to="/dashboard" className={isActive('/dashboard')}>Dashboard</Link>
        {(user?.role === 'admin' || user?.role === 'manager') && (
          <Link to="/users" className={isActive('/users')}>Users</Link>
        )}
        <Link to="/profile" className={isActive('/profile')}>My Profile</Link>
      </div>
      <div className="navbar-user">
        <span className={`role-badge role-${user?.role}`}>{user?.role}</span>
        <span className="user-name">{user?.name}</span>
        <button onClick={handleLogout} className="btn btn-outline btn-sm">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
