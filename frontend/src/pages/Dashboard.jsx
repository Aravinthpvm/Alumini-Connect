import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardService, mentorshipService, alumniService } from '../services/services';
import { getInitials, statusColor } from '../utils/helpers';
import { FiBriefcase, FiUsers, FiCalendar, FiMessageCircle, FiCheckCircle, FiClock, FiStar, FiShield } from 'react-icons/fi';

function StatCard({ icon, value, label, color }) {
    return (
        <div className="stat-card">
            <div className="stat-icon" style={{ background: color }}>{icon}</div>
            <div>
                <div className="stat-value">{value}</div>
                <div className="stat-label">{label}</div>
            </div>
        </div>
    );
}

export default function Dashboard() {
    const { user } = useAuth();
    const [data, setData] = useState(null);
    const [mentorships, setMentorships] = useState([]);
    const [pendingVerifications, setPendingVerifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                if (user?.role === 'STUDENT' && user?.profileId) {
                    const [dash, ment] = await Promise.all([
                        dashboardService.getStudentDashboard(user.profileId),
                        mentorshipService.getByStudent(user.profileId),
                    ]);
                    setData(dash.data.data);
                    setMentorships(ment.data.data || []);
                } else if (user?.role === 'ALUMNI' && user?.profileId) {
                    const [dash, ment] = await Promise.all([
                        dashboardService.getAlumniDashboard(user.profileId),
                        mentorshipService.getByAlumni(user.profileId),
                    ]);
                    setData(dash.data.data);
                    setMentorships(ment.data.data || []);
                } else if (user?.role === 'ADMIN') {
                    const [dash, pending] = await Promise.all([
                        dashboardService.getAdminDashboard(),
                        alumniService.getPendingVerifications(),
                    ]);
                    setData(dash.data.data);
                    setPendingVerifications(pending.data.data || []);
                }
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        };
        fetch();
    }, [user]);

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><span className="spinner" /></div>;

    const renderStudentDashboard = () => (
        <>
            <div className="dashboard-stats">
                <StatCard icon={<FiUsers />} value={data?.activeMentorships || 0} label="Active Mentors" color="rgba(99,102,241,0.15)" />
                <StatCard icon={<FiBriefcase />} value={data?.appliedJobs || 0} label="Jobs Applied" color="rgba(6,182,212,0.15)" />
                <StatCard icon={<FiCalendar />} value={data?.registeredEvents || 0} label="Events Joined" color="rgba(245,158,11,0.15)" />
                <StatCard icon={<FiMessageCircle />} value={data?.myQuestions || 0} label="Forum Posts" color="rgba(16,185,129,0.15)" />
            </div>
            <div className="grid grid-2" style={{ gap: 20 }}>
                <div className="card">
                    <div className="card-header"><h3>My Mentorships</h3></div>
                    <div className="card-body">
                        {mentorships.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-state__icon">🎯</div>
                                <div className="empty-state__title">No mentorships yet</div>
                                <div className="empty-state__desc">Browse the alumni directory to request mentorship</div>
                                <Link to="/alumni" className="btn btn-primary btn-sm mt-4">Find Mentors</Link>
                            </div>
                        ) : mentorships.slice(0, 4).map(m => (
                            <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--clr-border)' }}>
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Mentorship Request</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--txt-secondary)' }}>{m.areasOfInterest?.join(', ')}</div>
                                </div>
                                <span className={`badge badge-${statusColor(m.status)}`}>{m.status}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="card">
                    <div className="card-header"><h3>Quick Actions</h3></div>
                    <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <Link to="/alumni" className="btn btn-secondary w-full"><FiUsers size={15} /> Find a Mentor</Link>
                        <Link to="/jobs" className="btn btn-secondary w-full"><FiBriefcase size={15} /> Browse Jobs</Link>
                        <Link to="/events" className="btn btn-secondary w-full"><FiCalendar size={15} /> View Events</Link>
                        <Link to="/forum" className="btn btn-secondary w-full"><FiMessageCircle size={15} /> Ask in Forum</Link>
                    </div>
                </div>
            </div>
        </>
    );

    const renderAlumniDashboard = () => (
        <>
            <div className="dashboard-stats">
                <StatCard icon={<FiUsers />} value={data?.activeMentees || 0} label="Active Mentees" color="rgba(99,102,241,0.15)" />
                <StatCard icon={<FiClock />} value={data?.pendingRequests || 0} label="Pending Requests" color="rgba(245,158,11,0.15)" />
                <StatCard icon={<FiBriefcase />} value={data?.postedJobs || 0} label="Jobs Posted" color="rgba(6,182,212,0.15)" />
                <StatCard icon={<FiCalendar />} value={data?.organizedEvents || 0} label="Events Organized" color="rgba(16,185,129,0.15)" />
            </div>
            <div className="grid grid-2" style={{ gap: 20 }}>
                <div className="card">
                    <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3>Mentorship Requests</h3>
                        {data?.pendingRequests > 0 && <span className="badge badge-warning">{data.pendingRequests} pending</span>}
                    </div>
                    <div className="card-body">
                        {mentorships.filter(m => m.status === 'PENDING').length === 0 ? (
                            <p style={{ color: 'var(--txt-secondary)', fontSize: '0.9rem' }}>No pending requests</p>
                        ) : mentorships.filter(m => m.status === 'PENDING').slice(0, 4).map(m => (
                            <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--clr-border)' }}>
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>New Request</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--txt-secondary)', marginTop: 2 }}>{m.requestMessage?.slice(0, 60)}…</div>
                                </div>
                                <span className="badge badge-warning">Pending</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="card">
                    <div className="card-header"><h3>Quick Actions</h3></div>
                    <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <Link to="/jobs" className="btn btn-secondary w-full"><FiBriefcase size={15} /> Post a Job</Link>
                        <Link to="/events" className="btn btn-secondary w-full"><FiCalendar size={15} /> Create Event</Link>
                        <Link to="/stories" className="btn btn-secondary w-full"><FiStar size={15} /> Share Story</Link>
                        <Link to="/messages" className="btn btn-secondary w-full"><FiMessageCircle size={15} /> Messages</Link>
                    </div>
                </div>
            </div>
        </>
    );

    const renderAdminDashboard = () => (
        <>
            <div className="dashboard-stats">
                <StatCard icon={<span>🎓</span>} value={data?.totalStudents || 0} label="Total Students" color="rgba(99,102,241,0.15)" />
                <StatCard icon={<FiUsers />} value={data?.verifiedAlumni || 0} label="Verified Alumni" color="rgba(16,185,129,0.15)" />
                <StatCard icon={<FiClock />} value={data?.pendingVerifications || 0} label="Pending Verifications" color="rgba(245,158,11,0.15)" />
                <StatCard icon={<FiBriefcase />} value={data?.activeJobs || 0} label="Active Jobs" color="rgba(6,182,212,0.15)" />
                <StatCard icon={<FiCalendar />} value={data?.upcomingEvents || 0} label="Upcoming Events" color="rgba(244,114,182,0.15)" />
                <StatCard icon={<FiMessageCircle />} value={data?.totalQuestions || 0} label="Forum Questions" color="rgba(245,158,11,0.15)" />
            </div>
            <div className="card">
                <div className="card-header">
                    <h3>Pending Alumni Verifications</h3>
                </div>
                <div className="card-body">
                    {pendingVerifications.length === 0 ? (
                        <p style={{ color: 'var(--txt-secondary)', fontSize: '0.9rem' }}>No pending verifications</p>
                    ) : pendingVerifications.slice(0, 5).map(a => (
                        <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--clr-border)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div className="avatar avatar-sm">{getInitials(a.fullName)}</div>
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{a.fullName}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--txt-secondary)' }}>{a.currentCompany} • Batch {a.graduationYear}</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <button className="btn btn-success btn-sm">✓ Verify</button>
                                <button className="btn btn-danger btn-sm">✗ Reject</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );

    return (
        <div style={{ paddingTop: 'var(--nav-height)', minHeight: '100vh' }}>
            <div className="page-content">
                <div className="dashboard-header">
                    <div className="dashboard-welcome">
                        👋 Welcome back, <span>{user?.fullName?.split(' ')[0]}</span>
                    </div>
                    <div className="dashboard-sub">
                        {user?.role === 'ADMIN' ? 'Platform Overview' :
                            user?.role === 'ALUMNI' ? 'Your alumni dashboard — manage mentorships, jobs, and events' :
                                'Your student dashboard — track mentorships, applications, and events'}
                    </div>
                </div>

                {user?.role === 'STUDENT' && renderStudentDashboard()}
                {user?.role === 'ALUMNI' && renderAlumniDashboard()}
                {user?.role === 'ADMIN' && renderAdminDashboard()}
            </div>
        </div>
    );
}
