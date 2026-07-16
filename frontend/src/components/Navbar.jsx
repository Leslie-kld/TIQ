import { useNavigate } from 'react-router-dom';
import { Ticket, LogOut } from 'lucide-react';
import './Navbar.css';

function Navbar({ user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="navbar">
      <div className="navbar-brand">
        <Ticket size={20} />
        <span>DeskFlow</span>
      </div>
      <div className="navbar-right">
        <span className="navbar-user">
          {user?.email} <span className="navbar-role">({user?.role})</span>
        </span>
        <button className="navbar-logout" onClick={handleLogout}>
          <LogOut size={14} /> Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;
