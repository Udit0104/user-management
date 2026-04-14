import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';

const UserForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user', status: 'active' });
  const [autoPassword, setAutoPassword] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isEdit) {
      api.get(`/users/${id}`).then(({ data }) => {
        const u = data.user;
        setForm({ name: u.name, email: u.email, password: '', role: u.role, status: u.status });
      }).catch(() => navigate('/users'));
    }
  }, [id, isEdit, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const payload = { ...form };
      if (!payload.password) delete payload.password;
      if (autoPassword) delete payload.password;

      if (isEdit) {
        const { data } = await api.put(`/users/${id}`, payload);
        setSuccess('User updated successfully');
        if (currentUser._id === id) navigate('/profile');
      } else {
        const { data } = await api.post('/users', payload);
        if (data.generatedPassword) {
          setGeneratedPassword(data.generatedPassword);
          setSuccess(`User created! Auto-generated password: ${data.generatedPassword}`);
        } else {
          setSuccess('User created successfully');
        }
        setTimeout(() => navigate('/users'), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = currentUser?.role === 'admin';

  return (
    <Layout>
      <div className="page-container">
        <div className="page-header">
          <div>
            <button onClick={() => navigate(-1)} className="back-btn">← Back</button>
            <h2>{isEdit ? 'Edit User' : 'Create New User'}</h2>
          </div>
        </div>

        <div className="form-card">
          {error && <div className="alert alert-error">{error}</div>}
          {success && (
            <div className="alert alert-success">
              {success}
              {generatedPassword && <div className="generated-pw">Password: <code>{generatedPassword}</code></div>}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name *</label>
                <input type="text" required value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="John Doe" />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input type="email" required value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="john@example.com"
                  disabled={isEdit && !isAdmin} />
              </div>

              {isAdmin && (
                <>
                  <div className="form-group">
                    <label>Role</label>
                    <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                      <option value="user">User</option>
                      <option value="manager">Manager</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </>
              )}

              {currentUser?.role === 'manager' && isEdit && (
                <div className="form-group">
                  <label>Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              )}

              {!isEdit && isAdmin && (
                <div className="form-group checkbox-group">
                  <label>
                    <input type="checkbox" checked={autoPassword}
                      onChange={(e) => setAutoPassword(e.target.checked)} />
                    Auto-generate password
                  </label>
                </div>
              )}

              {(!autoPassword || isEdit) && (
                <div className="form-group">
                  <label>{isEdit ? 'New Password (leave blank to keep)' : 'Password *'}</label>
                  <input type="password" value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder={isEdit ? 'Leave blank to keep current' : 'Min 6 characters'}
                    required={!isEdit && !autoPassword}
                    minLength={6} />
                </div>
              )}
            </div>

            <div className="form-actions">
              <button type="button" onClick={() => navigate(-1)} className="btn btn-outline">Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : isEdit ? 'Update User' : 'Create User'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default UserForm;
