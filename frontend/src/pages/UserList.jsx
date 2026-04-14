import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';

const UserList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 10 });
      if (search) params.append('search', search);
      if (roleFilter) params.append('role', roleFilter);
      if (statusFilter) params.append('status', statusFilter);
      const { data } = await api.get(`/users?${params}`);
      setUsers(data.users);
      setTotal(data.total);
      setPages(data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, search, roleFilter, statusFilter]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/users/${id}`);
      setDeleteId(null);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deactivating user');
    }
  };

  return (
    <Layout>
      <div className="page-container">
        <div className="page-header">
          <div>
            <h2>Users</h2>
            <p>{total} total users</p>
          </div>
          {user?.role === 'admin' && (
            <Link to="/users/new" className="btn btn-primary">+ New User</Link>
          )}
        </div>

        <div className="filters-bar">
          <input
            type="text" placeholder="Search by name or email..."
            value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="search-input"
          />
          <select value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}>
            <option value="">All Roles</option>
            {user?.role === 'admin' && <option value="admin">Admin</option>}
            <option value="manager">Manager</option>
            <option value="user">User</option>
          </select>
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="table-container">
          {loading ? (
            <div className="table-loading"><div className="spinner" /></div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr><td colSpan="6" className="empty-row">No users found</td></tr>
                ) : users.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <div className="user-cell">
                        <div className="avatar">{u.name[0].toUpperCase()}</div>
                        <span>{u.name}</span>
                      </div>
                    </td>
                    <td>{u.email}</td>
                    <td><span className={`role-badge role-${u.role}`}>{u.role}</span></td>
                    <td><span className={`status-badge status-${u.status}`}>{u.status}</span></td>
                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="action-btns">
                        <button onClick={() => navigate(`/users/${u._id}`)} className="btn btn-sm btn-outline">View</button>
                        {(user?.role === 'admin' || (user?.role === 'manager' && u.role !== 'admin')) && (
                          <button onClick={() => navigate(`/users/${u._id}/edit`)} className="btn btn-sm btn-secondary">Edit</button>
                        )}
                        {user?.role === 'admin' && u._id !== user._id && (
                          <button onClick={() => setDeleteId(u._id)} className="btn btn-sm btn-danger">
                            {u.status === 'active' ? 'Deactivate' : 'Deleted'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {pages > 1 && (
          <div className="pagination">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="btn btn-sm btn-outline">← Prev</button>
            <span>Page {page} of {pages}</span>
            <button disabled={page === pages} onClick={() => setPage(p => p + 1)} className="btn btn-sm btn-outline">Next →</button>
          </div>
        )}

        {deleteId && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Deactivate User?</h3>
              <p>This will deactivate the user. They won&apos;t be able to log in.</p>
              <div className="modal-actions">
                <button onClick={() => setDeleteId(null)} className="btn btn-outline">Cancel</button>
                <button onClick={() => handleDelete(deleteId)} className="btn btn-danger">Deactivate</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default UserList;
