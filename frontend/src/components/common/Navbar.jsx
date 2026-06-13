import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils/helpers';
import { FiHome, FiUsers, FiBriefcase, FiCalendar, FiMessageCircle, FiStar, FiHelpCircle, FiLogOut, FiUser } from 'react-icons/fi';

export default function Navbar() {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => { logout(); navigate('/'); };

    const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';

    return (
        <nav className="navbar">
            <Link to="/" className="navbar__brand">
                <img src="/alumni-connect-logo.png" alt="" className="navbar__logo" />
                AlumniConnect
            </Link>

            <div className="navbar__nav">
                <Link to="/alumni" className={isActive('/alumni')}>
                    <FiUsers size={15} /> Directory
                </Link>
                <Link to="/jobs" className={isActive('/jobs')}>
                    <FiBriefcase size={15} /> Jobs
                </Link>
                <Link to="/events" className={isActive('/events')}>
                    <FiCalendar size={15} /> Events
                </Link>
                <Link to="/forum" className={isActive('/forum')}>
                    <FiHelpCircle size={15} /> Forum
                </Link>
                <Link to="/stories" className={isActive('/stories')}>
                    <FiStar size={15} /> Stories
                </Link>
            </div>

            <div className="navbar__actions">
                {user ? (
                    <>
                        <Link to="/messages" className="btn btn-ghost btn-icon" title="Messages">
                            <FiMessageCircle size={18} />
                        </Link>
                        <Link to="/dashboard" className="btn btn-ghost btn-icon" title="Dashboard">
                            <FiHome size={18} />
                        </Link>
                        <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div className="avatar avatar-sm" style={{ width: 32, height: 32, fontSize: '0.7rem' }}>
                                {user.profilePicture
                                    ? <img src={user.profilePicture} alt="" className="avatar avatar-sm" />
                                    : getInitials(user.fullName)}
                            </div>
                        </Link>
                        <button className="btn btn-ghost btn-sm" onClick={handleLogout} title="Logout">
                            <FiLogOut size={15} /> Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
                        <Link to="/register" className="btn btn-primary btn-sm">Join Now</Link>
                    </>
                )}
            </div>
        </nav>
    );
}
