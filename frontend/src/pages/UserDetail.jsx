import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';

const UserDetail = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/users/${id}`)
      .then(({ data }) => setUser(data.user))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load user'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Layout><div className="loading-screen"><div className="spinner" /></div></Layout>;
  if (error) return <Layout><div className="page-container"><div className="alert alert-error">{error}</div></div></Layout>;

  const canEdit = currentUser?.role === 'admin' ||
    (currentUser?.role === 'manager' && user?.role !== 'admin') ||
    currentUser?._id === id;

  return (
    <Layout>
      <div className="page-container">
        <div className="page-header">
          <div>
            <button onClick={() => navigate(-1)} className="back-btn">← Back</button>
            <h2>User Details</h2>
          </div>
          {canEdit && (
            <Link to={`/users/${id}/edit`} className="btn btn-primary">Edit User</Link>
          )}
        </div>

        <div className="detail-grid">
          <div className="detail-card">
            <div className="detail-avatar">{user?.name[0].toUpperCase()}</div>
            <h3>{user?.name}</h3>
            <span className={`role-badge role-${user?.role}`}>{user?.role}</span>
            <span className={`status-badge status-${user?.status}`}>{user?.status}</span>
          </div>

          <div className="detail-info">
            <div className="info-section">
              <h4>Account Information</h4>
              <div className="info-row"><span>Email</span><strong>{user?.email}</strong></div>
              <div className="info-row"><span>Role</span><strong>{user?.role}</strong></div>
              <div className="info-row"><span>Status</span><strong>{user?.status}</strong></div>
            </div>

            <div className="info-section">
              <h4>Audit Information</h4>
              <div className="info-row">
                <span>Created At</span>
                <strong>{new Date(user?.createdAt).toLocaleString()}</strong>
              </div>
              <div className="info-row">
                <span>Last Updated</span>
                <strong>{new Date(user?.updatedAt).toLocaleString()}</strong>
              </div>
              {user?.createdBy && (
                <div className="info-row">
                  <span>Created By</span>
                  <strong>{user.createdBy.name} ({user.createdBy.email})</strong>
                </div>
              )}
              {user?.updatedBy && (
                <div className="info-row">
                  <span>Last Updated By</span>
                  <strong>{user.updatedBy.name} ({user.updatedBy.email})</strong>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserDetail;
