import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Layout from '../components/Layout';

const StatCard = ({ label, value, icon, color }) => (
  <div className={`stat-card stat-${color}`}>
    <div className="stat-icon">{icon}</div>
    <div className="stat-info">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (user?.role === 'admin' || user?.role === 'manager') {
      api.get('/users?limit=1').then(({ data }) => {
        api.get('/users?limit=1&status=active').then(({ data: active }) => {
          api.get('/users?limit=1&status=inactive').then(({ data: inactive }) => {
            setStats({ total: data.total, active: active.total, inactive: inactive.total });
          });
        });
      }).catch(() => {});
    }
  }, [user]);

  return (
    <Layout>
      <div className="page-container">
        <div className="page-header">
          <h2>Welcome back, {user?.name} 👋</h2>
          <p>Here&apos;s what&apos;s happening in your workspace.</p>
        </div>

        {(user?.role === 'admin' || user?.role === 'manager') && stats && (
          <div className="stats-grid">
            <StatCard label="Total Users" value={stats.total} icon="👥" color="blue" />
            <StatCard label="Active Users" value={stats.active} icon="✅" color="green" />
            <StatCard label="Inactive Users" value={stats.inactive} icon="🚫" color="red" />
          </div>
        )}

        <div className="dashboard-cards">
          {(user?.role === 'admin' || user?.role === 'manager') && (
            <div className="dashboard-card">
              <div className="card-icon">👥</div>
              <h3>User Management</h3>
              <p>View, search, and manage all users in the system.</p>
              <Link to="/users" className="btn btn-primary">Manage Users</Link>
            </div>
          )}
          {user?.role === 'admin' && (
            <div className="dashboard-card">
              <div className="card-icon">➕</div>
              <h3>Create User</h3>
              <p>Add a new user with a specific role and permissions.</p>
              <Link to="/users/new" className="btn btn-success">Create User</Link>
            </div>
          )}
          <div className="dashboard-card">
            <div className="card-icon">👤</div>
            <h3>My Profile</h3>
            <p>View and update your personal information and password.</p>
            <Link to="/profile" className="btn btn-secondary">View Profile</Link>
          </div>
        </div>

        <div className="role-info-card">
          <h4>Your Access Level</h4>
          <div className="role-permissions">
            {user?.role === 'admin' && (
              <ul>
                <li>✅ Full user management (create, edit, delete)</li>
                <li>✅ Assign and change user roles</li>
                <li>✅ View all users and their details</li>
                <li>✅ Deactivate/reactivate accounts</li>
              </ul>
            )}
            {user?.role === 'manager' && (
              <ul>
                <li>✅ View all non-admin users</li>
                <li>✅ Update non-admin user details</li>
                <li>❌ Cannot create or delete users</li>
                <li>❌ Cannot change user roles</li>
              </ul>
            )}
            {user?.role === 'user' && (
              <ul>
                <li>✅ View and update your own profile</li>
                <li>❌ Cannot view other users</li>
                <li>❌ Cannot change your own role</li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
