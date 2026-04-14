import { useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';

const Profile = () => {
  const { user, updateCurrentUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (form.password && form.password !== form.confirmPassword) {
      return setError('Passwords do not match');
    }
    setLoading(true);
    try {
      const payload = { name: form.name };
      if (form.password) payload.password = form.password;
      const { data } = await api.put(`/users/${user._id}`, payload);
      updateCurrentUser(data.user);
      setSuccess('Profile updated successfully');
      setForm({ ...form, password: '', confirmPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="page-container">
        <div className="page-header">
          <h2>My Profile</h2>
        </div>

        <div className="profile-grid">
          <div className="profile-card">
            <div className="profile-avatar">{user?.name[0].toUpperCase()}</div>
            <h3>{user?.name}</h3>
            <p>{user?.email}</p>
            <span className={`role-badge role-${user?.role}`}>{user?.role}</span>
            <span className={`status-badge status-${user?.status}`}>{user?.status}</span>
            <div className="profile-meta">
              <div className="info-row"><span>Member since</span><strong>{new Date(user?.createdAt).toLocaleDateString()}</strong></div>
            </div>
          </div>

          <div className="form-card">
            <h4>Update Profile</h4>
            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" required value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Email (cannot change)</label>
                <input type="email" value={user?.email} disabled />
              </div>
              <div className="form-group">
                <label>Role (cannot change)</label>
                <input type="text" value={user?.role} disabled />
              </div>
              <hr className="divider" />
              <h5>Change Password</h5>
              <div className="form-group">
                <label>New Password</label>
                <input type="password" value={form.password} minLength={6}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Leave blank to keep current" />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input type="password" value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  placeholder="Confirm new password" />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
