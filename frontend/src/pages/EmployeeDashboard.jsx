import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { PriorityBadge, StatusBadge } from '../components/Badge';
import { formatTicketRef } from '../lib/ticketFormat';
import { useLiveTime, formatAgo } from '../lib/useLiveTime';
import './Dashboard.css';

const POLL_INTERVAL = 5000;

function EmployeeDashboard() {
  const navigate = useNavigate();
  const now = useLiveTime(1000);
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Low');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) {
      navigate('/');
      return;
    }
    const parsed = JSON.parse(stored);
    if (parsed.role !== 'Employee') {
      navigate('/admin');
      return;
    }
    setUser(parsed);
  }, [navigate]);

  const fetchTickets = async (userId, showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const { data } = await axios.get('http://localhost:5000/api/tickets', {
        params: { userId, role: 'Employee' }
      });
      setTickets(data);
    } catch (err) {
      console.error('Error fetching tickets:', err);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  // Initial load, then poll every few seconds so status changes made by
  // an Admin elsewhere show up here without a manual refresh.
  useEffect(() => {
    if (!user) return;
    fetchTickets(user.id, true);
    const interval = setInterval(() => fetchTickets(user.id), POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!title.trim() || !description.trim()) {
      setFormError('Title and description are required');
      return;
    }

    setSubmitting(true);
    try {
      await axios.post('http://localhost:5000/api/tickets', {
        title,
        description,
        priority,
        createdById: user.id
      });
      setTitle('');
      setDescription('');
      setPriority('Low');
      fetchTickets(user.id);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create ticket');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="dashboard">
      <Navbar user={user} />
      <div className="dashboard-content">
        <h1>My Dashboard</h1>
        <p className="dashboard-subtitle">Submit a new request or check on your existing tickets.</p>

        <div className="dashboard-grid">
          <div className="card">
            <div className="card-header">
              <h2>Submit a Ticket</h2>
            </div>
            {formError && <p className="form-error">{formError}</p>}
            <form onSubmit={handleSubmit}>
              <label>Title</label>
              <input
                type="text"
                className="input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Brief summary of the issue"
              />

              <label>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue in detail"
                rows={4}
              />

              <label>Priority</label>
              <select className="input" value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>

              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Submitting…' : 'Submit Ticket'}
              </button>
            </form>
          </div>

          <div className="card">
            <div className="card-header">
              <h2>My Tickets</h2>
              <span className="live-indicator">
                <span className="live-dot" /> Live
              </span>
            </div>
            {loading ? (
              <p className="empty-state">Loading…</p>
            ) : tickets.length === 0 ? (
              <p className="empty-state">No tickets logged yet.</p>
            ) : (
              <div className="ticket-list">
                {tickets.map((t) => (
                  <div key={t.id} className="ticket-row">
                    <div className="ticket-info">
                      <p className="ticket-ref">
                        {formatTicketRef(t.id)} · {formatAgo(t.createdAt, now)}
                      </p>
                      <p className="ticket-title">{t.title}</p>
                      <p className="ticket-desc">{t.description}</p>
                    </div>
                    <div className="ticket-badges">
                      <PriorityBadge priority={t.priority} />
                      <StatusBadge status={t.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeDashboard;
