import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { jobService } from '../services/services';
import { useAuth } from '../context/AuthContext';
import { timeAgo, jobTypeBadge, extractError } from '../utils/helpers';
import { FiMapPin, FiBriefcase, FiClock, FiArrowLeft, FiSend } from 'react-icons/fi';

export default function JobDetails() {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [showApply, setShowApply] = useState(false);
    const [coverLetter, setCoverLetter] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        jobService.getById(id).then(r => setJob(r.data.data)).finally(() => setLoading(false));
    }, [id]);

    const handleApply = async (e) => {
        e.preventDefault();
        if (!user) { navigate('/login'); return; }
        setApplying(true);
        try {
            await jobService.apply(id, user.profileId, { coverLetter });
            alert('Application submitted successfully!');
            setShowApply(false);
        } catch (err) { alert(extractError(err)); }
        finally { setApplying(false); }
    };

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><span className="spinner" /></div>;
    if (!job) return <div style={{ paddingTop: 'var(--nav-height)' }}><div className="page-content"><p>Job not found</p></div></div>;

    return (
        <div style={{ paddingTop: 'var(--nav-height)', minHeight: '100vh' }}>
            <div className="page-content" style={{ maxWidth: 800 }}>
                <Link to="/jobs" className="btn btn-ghost btn-sm" style={{ marginBottom: 20 }}><FiArrowLeft /> Back to Jobs</Link>

                <div className="card">
                    <div className="card-body">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 24 }}>
                            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                                <div className="job-card__logo" style={{ width: 56, height: 56, fontSize: '1.4rem' }}>{job.company?.[0]}</div>
                                <div>
                                    <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 4 }}>{job.jobTitle}</h1>
                                    <p style={{ color: 'var(--txt-secondary)', fontSize: '1rem' }}>{job.company}</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <span className="badge badge-primary">{jobTypeBadge(job.jobType)}</span>
                                {job.locationType && <span className="badge badge-ghost">{job.locationType}</span>}
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 24 }}>
                            {job.location && <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--txt-secondary)', fontSize: '0.9rem' }}><FiMapPin size={14} />{job.location}</span>}
                            {job.experienceRequired && <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--txt-secondary)', fontSize: '0.9rem' }}><FiBriefcase size={14} />{job.experienceRequired}</span>}
                            <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--txt-secondary)', fontSize: '0.9rem' }}><FiClock size={14} />{timeAgo(job.createdAt)}</span>
                            {job.viewCount > 0 && <span style={{ color: 'var(--txt-muted)', fontSize: '0.875rem' }}>{job.viewCount} views</span>}
                        </div>

                        {job.preferredSkills?.length > 0 && (
                            <div style={{ marginBottom: 24 }}>
                                <h4 style={{ marginBottom: 10 }}>Preferred Skills</h4>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                    {job.preferredSkills.map(s => <span key={s} className="badge badge-primary">{s}</span>)}
                                </div>
                            </div>
                        )}

                        {job.description && (
                            <div style={{ marginBottom: 24 }}>
                                <h4 style={{ marginBottom: 10 }}>Job Description</h4>
                                <p style={{ color: 'var(--txt-secondary)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{job.description}</p>
                            </div>
                        )}

                        {job.requirements && (
                            <div style={{ marginBottom: 24 }}>
                                <h4 style={{ marginBottom: 10 }}>Requirements</h4>
                                <p style={{ color: 'var(--txt-secondary)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{job.requirements}</p>
                            </div>
                        )}

                        {job.salaryRange?.min && (
                            <div style={{ background: 'var(--clr-bg-3)', borderRadius: 'var(--rad-md)', padding: '16px', marginBottom: 24 }}>
                                <h4 style={{ marginBottom: 4 }}>Compensation</h4>
                                <p style={{ color: 'var(--clr-success)', fontWeight: 700, fontSize: '1.1rem' }}>
                                    ₹{(job.salaryRange.min / 100000).toFixed(1)}L - ₹{(job.salaryRange.max / 100000).toFixed(1)}L per annum
                                </p>
                            </div>
                        )}

                        {user?.role === 'STUDENT' && job.status === 'ACTIVE' && (
                            <button className="btn btn-primary btn-lg w-full" onClick={() => setShowApply(true)}>
                                <FiSend /> Apply Now
                            </button>
                        )}
                        {!user && (
                            <Link to="/login" className="btn btn-primary btn-lg w-full"><FiSend /> Login to Apply</Link>
                        )}
                    </div>
                </div>

                {showApply && (
                    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowApply(false)}>
                        <div className="modal">
                            <div className="modal-header">
                                <h3>Apply to {job.jobTitle}</h3>
                                <button className="btn btn-ghost btn-icon" onClick={() => setShowApply(false)}>✕</button>
                            </div>
                            <form onSubmit={handleApply}>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label className="form-label">Cover Letter (optional)</label>
                                        <textarea className="form-control" rows={5}
                                            placeholder="Tell them why you're perfect for this role..."
                                            value={coverLetter} onChange={e => setCoverLetter(e.target.value)} />
                                    </div>
                                    <p style={{ fontSize: '0.8125rem', color: 'var(--txt-muted)' }}>
                                        Your resume from your profile will be attached automatically.
                                    </p>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-ghost" onClick={() => setShowApply(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary" disabled={applying}>
                                        {applying ? '...' : 'Submit Application'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
