import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { studentService, alumniService, jobService } from '../services/services';
import { getInitials, extractError } from '../utils/helpers';
import { FiEdit, FiLinkedin, FiGithub, FiGlobe, FiMapPin, FiBriefcase, FiSave, FiX } from 'react-icons/fi';

export default function Profile() {
    const { user, updateUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({});
    const [saving, setSaving] = useState(false);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                if (!user?.profileId) return;
                if (user.role === 'STUDENT') {
                    const [prof, apps] = await Promise.all([
                        studentService.getById(user.profileId),
                        jobService.getStudentApplications(user.profileId),
                    ]);
                    setProfile(prof.data.data);
                    setApplications(apps.data.data || []);
                    setForm(prof.data.data);
                } else if (user.role === 'ALUMNI') {
                    const [prof, myJobs] = await Promise.all([
                        alumniService.getById(user.profileId),
                        jobService.getByAlumni(user.profileId),
                    ]);
                    setProfile(prof.data.data);
                    setApplications(myJobs.data.data || []);
                    setForm(prof.data.data);
                }
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        };
        fetch();
    }, [user]);

    const handleSave = async () => {
        setSaving(true);
        try {
            let res;
            if (user.role === 'STUDENT') {
                res = await studentService.update(user.profileId, form);
            } else {
                res = await alumniService.update(user.profileId, form);
            }
            setProfile(res.data.data);
            setEditing(false);
        } catch (e) { alert(extractError(e)); }
        finally { setSaving(false); }
    };

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            let res;
            if (user.role === 'STUDENT') res = await studentService.uploadPhoto(user.profileId, file);
            else res = await alumniService.uploadPhoto(user.profileId, file);
            setProfile(res.data.data);
        } catch (e) { alert(extractError(e)); }
    };

    const handleResumeUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            const res = await studentService.uploadResume(user.profileId, file);
            setProfile(res.data.data);
            alert('Resume uploaded!');
        } catch (e) { alert(extractError(e)); }
    };

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><span className="spinner" /></div>;

    return (
        <div style={{ paddingTop: 'var(--nav-height)', minHeight: '100vh' }}>
            <div className="page-content" style={{ maxWidth: 900 }}>
                <div className="grid grid-2" style={{ gap: 24, alignItems: 'start' }}>
                    {/* Profile Card */}
                    <div>
                        <div className="card">
                            <div style={{ height: 100, background: 'var(--grad-primary)', borderRadius: 'var(--rad-xl) var(--rad-xl) 0 0', position: 'relative' }}>
                                <label style={{ position: 'absolute', bottom: -36, left: 24, cursor: 'pointer' }}>
                                    <div className="avatar avatar-xl" style={{ border: '4px solid var(--clr-bg)', background: 'var(--grad-primary)' }}>
                                        {profile?.profilePicture
                                            ? <img src={profile.profilePicture} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                                            : getInitials(user?.fullName)}
                                    </div>
                                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoUpload} />
                                </label>
                            </div>
                            <div className="card-body" style={{ paddingTop: 48 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{user?.fullName}</h2>
                                        <p style={{ color: 'var(--txt-secondary)', fontSize: '0.9rem', marginTop: 3 }}>
                                            {user?.role === 'STUDENT'
                                                ? `${profile?.branch} • Year ${profile?.currentYear} • Batch ${profile?.graduationYear}`
                                                : `${profile?.currentPosition || ''}${profile?.currentCompany ? ` @ ${profile.currentCompany}` : ''}`}
                                        </p>
                                    </div>
                                    <button className="btn btn-secondary btn-sm" onClick={() => setEditing(!editing)}>
                                        {editing ? <><FiX /> Cancel</> : <><FiEdit /> Edit</>}
                                    </button>
                                </div>

                                <div className="divider" />

                                {/* Stats row */}
                                <div style={{ display: 'flex', gap: 24 }}>
                                    {user?.role === 'STUDENT' && (
                                        <>
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{ fontWeight: 800, fontSize: '1.25rem' }}>{profile?.cgpa || '-'}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--txt-muted)' }}>CGPA</div>
                                            </div>
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{ fontWeight: 800, fontSize: '1.25rem' }}>{applications.length}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--txt-muted)' }}>Applied</div>
                                            </div>
                                        </>
                                    )}
                                    {user?.role === 'ALUMNI' && (
                                        <>
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{ fontWeight: 800, fontSize: '1.25rem' }}>{profile?.yearsOfExperience || '-'}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--txt-muted)' }}>Yrs Exp</div>
                                            </div>
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{ fontWeight: 800, fontSize: '1.25rem' }}>{applications.length}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--txt-muted)' }}>Jobs Posted</div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Social links */}
                                <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                                    {profile?.linkedinUrl && <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="btn btn-secondary btn-icon"><FiLinkedin size={15} /></a>}
                                    {profile?.githubUrl && <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="btn btn-secondary btn-icon"><FiGithub size={15} /></a>}
                                    {(profile?.portfolioUrl || profile?.personalWebsite) && <a href={profile.portfolioUrl || profile.personalWebsite} target="_blank" rel="noreferrer" className="btn btn-secondary btn-icon"><FiGlobe size={15} /></a>}
                                </div>

                                {/* Skills */}
                                {profile?.skills?.length > 0 && (
                                    <div style={{ marginTop: 16 }}>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--txt-muted)', marginBottom: 8 }}>Skills</div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                                            {profile.skills.map(s => <span key={s} className="badge badge-primary">{s}</span>)}
                                        </div>
                                    </div>
                                )}

                                {/* Resume upload for students */}
                                {user?.role === 'STUDENT' && (
                                    <div style={{ marginTop: 16 }}>
                                        <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
                                            📎 Upload Resume (PDF)
                                            <input type="file" accept=".pdf" style={{ display: 'none' }} onChange={handleResumeUpload} />
                                        </label>
                                        {profile?.resume && <a href={profile.resume} target="_blank" rel="noreferrer" style={{ marginLeft: 10, fontSize: '0.8rem', color: 'var(--clr-primary-light)' }}>View Current Resume</a>}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Edit / Info Panel */}
                    <div>
                        {editing ? (
                            <div className="card">
                                <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <h3>Edit Profile</h3>
                                    <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}>
                                        {saving ? '...' : <><FiSave /> Save</>}
                                    </button>
                                </div>
                                <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                    {user?.role === 'ALUMNI' && (
                                        <>
                                            {[['currentCompany', 'Company', 'text'], ['currentPosition', 'Position', 'text'], ['industry', 'Industry', 'text'], ['location', 'Location', 'text'], ['bio', 'Bio', 'textarea'], ['linkedinUrl', 'LinkedIn URL', 'text'], ['githubUrl', 'GitHub URL', 'text'], ['personalWebsite', 'Website URL', 'text']].map(([n, l, t]) => (
                                                <div key={n} className="form-group">
                                                    <label className="form-label">{l}</label>
                                                    {t === 'textarea'
                                                        ? <textarea className="form-control" rows={3} value={form[n] || ''} onChange={e => setForm(f => ({ ...f, [n]: e.target.value }))} />
                                                        : <input type="text" className="form-control" value={form[n] || ''} onChange={e => setForm(f => ({ ...f, [n]: e.target.value }))} />
                                                    }
                                                </div>
                                            ))}
                                            <div className="form-group">
                                                <label style={{ display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer' }}>
                                                    <input type="checkbox" checked={form.availableForMentorship || false}
                                                        onChange={e => setForm(f => ({ ...f, availableForMentorship: e.target.checked }))} />
                                                    <span>Available for Mentorship</span>
                                                </label>
                                            </div>
                                        </>
                                    )}
                                    {user?.role === 'STUDENT' && (
                                        <>
                                            {[['bio', 'Bio', 'textarea'], ['careerGoals', 'Career Goals', 'textarea'], ['linkedinUrl', 'LinkedIn URL', 'text'], ['githubUrl', 'GitHub URL', 'text'], ['portfolioUrl', 'Portfolio URL', 'text']].map(([n, l, t]) => (
                                                <div key={n} className="form-group">
                                                    <label className="form-label">{l}</label>
                                                    {t === 'textarea'
                                                        ? <textarea className="form-control" rows={3} value={form[n] || ''} onChange={e => setForm(f => ({ ...f, [n]: e.target.value }))} />
                                                        : <input type="text" className="form-control" value={form[n] || ''} onChange={e => setForm(f => ({ ...f, [n]: e.target.value }))} />
                                                    }
                                                </div>
                                            ))}
                                        </>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="card">
                                <div className="card-header"><h3>{user?.role === 'ALUMNI' ? 'Jobs Posted' : 'My Applications'}</h3></div>
                                <div className="card-body">
                                    {applications.length === 0 ? (
                                        <p style={{ color: 'var(--txt-secondary)', fontSize: '0.9rem' }}>
                                            {user?.role === 'ALUMNI' ? 'No jobs posted yet' : 'No applications yet'}
                                        </p>
                                    ) : applications.slice(0, 5).map(a => (
                                        <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--clr-border)' }}>
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{a.jobTitle || a.company || 'Job'}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--txt-secondary)' }}>{user?.role === 'STUDENT' ? a.company : `${a.applicationCount || 0} applications`}</div>
                                            </div>
                                            <span className={`badge badge-${a.status === 'ACTIVE' ? 'success' : a.status === 'CLOSED' ? 'danger' : a.status === 'ACCEPTED' ? 'success' : a.status === 'REJECTED' ? 'danger' : 'warning'}`}>
                                                {a.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Bio card when not editing */}
                        {!editing && (profile?.bio || profile?.careerGoals) && (
                            <div className="card" style={{ marginTop: 16 }}>
                                <div className="card-header"><h3>About</h3></div>
                                <div className="card-body">
                                    {profile?.bio && <p style={{ color: 'var(--txt-secondary)', lineHeight: 1.75, fontSize: '0.9rem' }}>{profile.bio}</p>}
                                    {profile?.careerGoals && (
                                        <div style={{ marginTop: 14 }}>
                                            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--txt-muted)', marginBottom: 6 }}>Career Goals</div>
                                            <p style={{ color: 'var(--txt-secondary)', lineHeight: 1.75, fontSize: '0.9rem' }}>{profile.careerGoals}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
