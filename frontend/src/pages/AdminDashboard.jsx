import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { PriorityBadge, StatusBadge } from '../components/Badge';
import { formatTicketRef } from '../lib/ticketFormat';
import { useLiveTime, formatAgo } from '../lib/useLiveTime';
import './Dashboard.css';

const POLL_INTERVAL = 5000;
const STATUSES = [
  { value: 'Open', label: 'Open' },
  { value: 'InProgress', label: 'In Progress' },
  { value: 'Resolved', label: 'Resolved' }
];

function AdminDashboard() {
  const navigate = useNavigate();
  const now = useLiveTime(1000);
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) {
      navigate('/');
      return;
    }
    const parsed = JSON.parse(stored);
    if (parsed.role !== 'Admin') {
      navigate('/employee');
      return;
    }
    setUser(parsed);
  }, [navigate]);

  const fetchTickets = async (userId, showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const { data } = await axios.get('http://localhost:5000/api/tickets', {
        params: { userId, role: 'Admin' }
      });
      setTickets(data);
    } catch (err) {
      console.error('Error fetching tickets:', err);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  // Initial load, then poll every few seconds so newly submitted tickets
  // from Employees show up here automatically.
  useEffect(() => {
    if (!user) return;
    fetchTickets(user.id, true);
    const interval = setInterval(() => fetchTickets(user.id), POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [user]);

  const handleStatusChange = async (ticketId, newStatus) => {
    setUpdatingId(ticketId);
    try {
      await axios.put(`http://localhost:5000/api/tickets/${ticketId}`, {
        status: newStatus
      });
      setTickets((prev) =>
        prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t))
      );
    } catch (err) {
      console.error('Error updating ticket:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  if (!user) return null;

  return (
    <div className="dashboard">
      <Navbar user={user} />
      <div className="dashboard-content">
        <h1>All Tickets</h1>
        <p className="dashboard-subtitle">Every ticket submitted across the organization.</p>

        <div className="card">
          <div className="card-header">
            <h2>Ticket Feed</h2>
            <span className="live-indicator">
              <span className="live-dot" /> Live
            </span>
          </div>
          {loading ? (
            <p className="empty-state">Loading…</p>
          ) : tickets.length === 0 ? (
            <p className="empty-state">No tickets have been submitted yet.</p>
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
                    <p className="ticket-meta">submitted_by: user#{t.createdById}</p>
                  </div>
                  <div className="ticket-badges">
                    <PriorityBadge priority={t.priority} />
                    <div className="status-pills">
                      {STATUSES.map((s) => (
                        <button
                          key={s.value}
                          type="button"
                          className={`btn btn-secondary ${t.status === s.value ? 'active' : ''}`}
                          disabled={updatingId === t.id}
                          onClick={() => handleStatusChange(t.id, s.value)}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
