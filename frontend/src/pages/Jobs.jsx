import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jobService } from '../services/services';
import { timeAgo, statusColor, jobTypeBadge } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import { FiSearch, FiMapPin, FiBriefcase, FiClock, FiDollarSign, FiPlus, FiFilter } from 'react-icons/fi';

export default function Jobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [showPostModal, setShowPostModal] = useState(false);
    const [form, setForm] = useState({});
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        jobService.getAll().then(r => setJobs(r.data.data || [])).catch(console.error).finally(() => setLoading(false));
    }, []);

    const filtered = jobs.filter(j =>
        (!search || j.jobTitle?.toLowerCase().includes(search.toLowerCase()) || j.company?.toLowerCase().includes(search.toLowerCase())) &&
        (!typeFilter || j.jobType === typeFilter)
    );

    const handlePostJob = async (e) => {
        e.preventDefault();
        try {
            const res = await jobService.create(user.profileId, form);
            setJobs(prev => [res.data.data, ...prev]);
            setShowPostModal(false);
            setForm({});
        } catch (err) { alert('Failed to post job'); }
    };

    return (
        <div style={{ paddingTop: 'var(--nav-height)', minHeight: '100vh' }}>
            <div className="page-content">
                <div className="page-header">
                    <div>
                        <h1>Job Board</h1>
                        <p>Opportunities posted by alumni directly for you</p>
                    </div>
                    {user?.role === 'ALUMNI' && (
                        <button className="btn btn-primary" onClick={() => setShowPostModal(true)}>
                            <FiPlus /> Post a Job
                        </button>
                    )}
                </div>

                {/* Search & filter */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
                    <div className="search-bar" style={{ flex: 1 }}>
                        <span className="search-icon"><FiSearch /></span>
                        <input placeholder="Search jobs or companies..." value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    <select className="form-control" style={{ width: 180 }} value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                        <option value="">All Types</option>
                        <option value="FULL_TIME">Full Time</option>
                        <option value="INTERNSHIP">Internship</option>
                        <option value="CONTRACT">Contract</option>
                    </select>
                </div>

                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><span className="spinner" /></div>
                ) : filtered.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state__icon"><FiBriefcase /></div>
                        <div className="empty-state__title">No jobs found</div>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {filtered.map(j => (
                            <div key={j.id} className="job-card" onClick={() => navigate(`/jobs/${j.id}`)}>
                                <div className="job-card__header">
                                    <div className="job-card__company-info">
                                        <div className="job-card__logo">{j.company?.[0] || '?'}</div>
                                        <div>
                                            <div className="job-card__title">{j.jobTitle}</div>
                                            <div className="job-card__company">{j.company}</div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                                        <span className="badge badge-primary">{jobTypeBadge(j.jobType)}</span>
                                        {j.locationType && <span className="badge badge-ghost">{j.locationType}</span>}
                                    </div>
                                </div>
                                <div className="job-card__meta">
                                    {j.location && <span className="job-card__meta-item"><FiMapPin size={12} /> {j.location}</span>}
                                    {j.experienceRequired && <span className="job-card__meta-item"><FiBriefcase size={12} /> {j.experienceRequired}</span>}
                                    {j.salaryRange?.min && <span className="job-card__meta-item"><FiDollarSign size={12} /> ₹{j.salaryRange.min / 100000}L - ₹{j.salaryRange.max / 100000}L</span>}
                                    <span className="job-card__meta-item"><FiClock size={12} /> {timeAgo(j.createdAt)}</span>
                                </div>
                                {j.preferredSkills?.length > 0 && (
                                    <div className="job-card__skills">
                                        {j.preferredSkills.slice(0, 5).map(s => <span key={s} className="badge badge-ghost">{s}</span>)}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Post Job Modal */}
                {showPostModal && (
                    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowPostModal(false)}>
                        <div className="modal">
                            <div className="modal-header">
                                <h3>Post a Job Opportunity</h3>
                                <button className="btn btn-ghost btn-icon" onClick={() => setShowPostModal(false)}>✕</button>
                            </div>
                            <form onSubmit={handlePostJob}>
                                <div className="modal-body">
                                    {[['jobTitle', 'Job Title', 'text', 'Software Engineer Intern'], ['company', 'Company', 'text', 'Your Company'], ['location', 'Location', 'text', 'Bangalore / Remote'], ['experienceRequired', 'Experience Required', 'text', '0-1 years / Freshers']].map(([name, label, type, ph]) => (
                                        <div key={name} className="form-group">
                                            <label className="form-label">{label}</label>
                                            <input name={name} type={type} placeholder={ph} className="form-control" required
                                                value={form[name] || ''} onChange={e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))} />
                                        </div>
                                    ))}
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                                        <div className="form-group">
                                            <label className="form-label">Job Type</label>
                                            <select className="form-control" required value={form.jobType || ''} onChange={e => setForm(f => ({ ...f, jobType: e.target.value }))}>
                                                <option value="">Select</option>
                                                <option value="FULL_TIME">Full Time</option>
                                                <option value="INTERNSHIP">Internship</option>
                                                <option value="CONTRACT">Contract</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Location Type</label>
                                            <select className="form-control" value={form.locationType || ''} onChange={e => setForm(f => ({ ...f, locationType: e.target.value }))}>
                                                <option value="">Select</option>
                                                <option value="ONSITE">On-site</option>
                                                <option value="REMOTE">Remote</option>
                                                <option value="HYBRID">Hybrid</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Description</label>
                                        <textarea className="form-control" rows={3} placeholder="Job description and responsibilities..."
                                            value={form.description || ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Requirements</label>
                                        <textarea className="form-control" rows={2} placeholder="Required skills and qualifications..."
                                            value={form.requirements || ''} onChange={e => setForm(f => ({ ...f, requirements: e.target.value }))} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Application Email</label>
                                        <input type="email" className="form-control" placeholder="Apply at this email"
                                            value={form.applicationEmail || ''} onChange={e => setForm(f => ({ ...f, applicationEmail: e.target.value }))} />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-ghost" onClick={() => setShowPostModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary">Post Job</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
