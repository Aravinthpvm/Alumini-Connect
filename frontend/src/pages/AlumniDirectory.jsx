import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { alumniService, mentorshipService } from '../services/services';
import { getInitials, extractError } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import { FiSearch, FiMapPin, FiBriefcase, FiLinkedin, FiGithub, FiUsers, FiFilter } from 'react-icons/fi';

const DOMAINS = ['Frontend', 'Backend', 'Full Stack', 'ML/AI', 'Data Science', 'DevOps', 'Mobile', 'Cloud'];
const INDUSTRIES = ['Tech', 'Finance', 'Consulting', 'Healthcare', 'Education', 'Startup', 'Other'];
const YEARS = ['2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015'];

export default function AlumniDirectory() {
    const [alumni, setAlumni] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState({ name: '', company: '', domain: '', industry: '', location: '', graduationYear: '', availableForMentorship: false });
    const [showFilters, setShowFilters] = useState(false);
    const [requesting, setRequesting] = useState({});
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => { fetchAlumni(); }, []);

    const fetchAlumni = async (params = {}) => {
        setLoading(true);
        try {
            const res = Object.keys(params).some(k => params[k])
                ? await alumniService.search(params)
                : await alumniService.getDirectory();
            setAlumni(res.data.data || []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handleSearch = () => {
        const params = {};
        if (search.name) params.name = search.name;
        if (search.company) params.company = search.company;
        if (search.domain) params.domain = search.domain;
        if (search.industry) params.industry = search.industry;
        if (search.location) params.location = search.location;
        if (search.graduationYear) params.graduationYear = parseInt(search.graduationYear);
        if (search.availableForMentorship) params.availableForMentorship = true;
        fetchAlumni(params);
    };

    const handleMentorshipRequest = async (alumniId) => {
        if (!user) { navigate('/login'); return; }
        if (user.role !== 'STUDENT') return;
        setRequesting(r => ({ ...r, [alumniId]: true }));
        try {
            await mentorshipService.request(user.profileId, {
                alumniId,
                requestMessage: "Hi! I would love to connect with you for mentorship guidance.",
                areasOfInterest: ["Career Guidance", "Interview Preparation"]
            });
            alert('Mentorship request sent!');
        } catch (e) {
            alert(extractError(e));
        } finally {
            setRequesting(r => ({ ...r, [alumniId]: false }));
        }
    };

    return (
        <div style={{ paddingTop: 'var(--nav-height)', minHeight: '100vh' }}>
            <div className="page-content">
                <div className="page-header">
                    <div>
                        <h1>Alumni Directory</h1>
                        <p>Connect with verified alumni from your college</p>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                        <button className="btn btn-secondary" onClick={() => setShowFilters(!showFilters)}>
                            <FiFilter size={14} /> Filters
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                    <div className="search-bar" style={{ flex: 1 }}>
                        <span className="search-icon"><FiSearch /></span>
                        <input placeholder="Search by name..." value={search.name}
                            onChange={e => setSearch(s => ({ ...s, name: e.target.value }))}
                            onKeyDown={e => e.key === 'Enter' && handleSearch()} />
                    </div>
                    <div className="search-bar" style={{ flex: 1 }}>
                        <span className="search-icon"><FiBriefcase /></span>
                        <input placeholder="Company..." value={search.company}
                            onChange={e => setSearch(s => ({ ...s, company: e.target.value }))}
                            onKeyDown={e => e.key === 'Enter' && handleSearch()} />
                    </div>
                    <button className="btn btn-primary" onClick={handleSearch}><FiSearch size={15} /> Search</button>
                </div>

                {/* Filters */}
                {showFilters && (
                    <div className="card" style={{ padding: 20, marginBottom: 20 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14 }}>
                            <div className="form-group">
                                <label className="form-label">Domain</label>
                                <select className="form-control" value={search.domain} onChange={e => setSearch(s => ({ ...s, domain: e.target.value }))}>
                                    <option value="">All Domains</option>
                                    {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Industry</label>
                                <select className="form-control" value={search.industry} onChange={e => setSearch(s => ({ ...s, industry: e.target.value }))}>
                                    <option value="">All Industries</option>
                                    {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Graduation Year</label>
                                <select className="form-control" value={search.graduationYear} onChange={e => setSearch(s => ({ ...s, graduationYear: e.target.value }))}>
                                    <option value="">Any Year</option>
                                    {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Location</label>
                                <input className="form-control" placeholder="City..." value={search.location}
                                    onChange={e => setSearch(s => ({ ...s, location: e.target.value }))} />
                            </div>
                            <div className="form-group" style={{ alignSelf: 'flex-end' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                                    <input type="checkbox" checked={search.availableForMentorship}
                                        onChange={e => setSearch(s => ({ ...s, availableForMentorship: e.target.checked }))} />
                                    <span style={{ fontSize: '0.875rem' }}>Available for Mentorship</span>
                                </label>
                            </div>
                        </div>
                        <button className="btn btn-primary btn-sm" style={{ marginTop: 12 }} onClick={handleSearch}>Apply Filters</button>
                    </div>
                )}

                {/* Results */}
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><span className="spinner" /></div>
                ) : alumni.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state__icon"><FiUsers /></div>
                        <div className="empty-state__title">No alumni found</div>
                        <div className="empty-state__desc">Try adjusting your search or filters</div>
                    </div>
                ) : (
                    <div className="grid grid-auto">
                        {alumni.map(a => (
                            <div key={a.id} className="profile-card">
                                <div className="profile-card__banner" style={{ background: `linear-gradient(135deg, hsl(${(a.fullName?.charCodeAt(0) || 0) * 10 % 360}, 60%, 30%), hsl(${(a.fullName?.charCodeAt(0) || 0) * 10 % 360 + 60}, 60%, 20%))` }} />
                                <div className="profile-card__body">
                                    <div className="profile-card__avatar avatar avatar-md"
                                        style={{ width: 60, height: 60, marginTop: -30, marginBottom: 12, border: '3px solid var(--clr-bg)', background: 'var(--grad-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.1rem', borderRadius: '50%' }}>
                                        {a.profilePicture ? <img src={a.profilePicture} alt="" style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover' }} /> : getInitials(a.fullName)}
                                    </div>
                                    <div className="profile-card__name">{a.fullName}</div>
                                    <div className="profile-card__title">{a.currentPosition} {a.currentCompany ? `@ ${a.currentCompany}` : ''}</div>

                                    <div className="profile-card__meta mt-2">
                                        {a.location && <div className="profile-card__meta-item"><FiMapPin size={12} /> {a.location}</div>}
                                        {a.graduationYear && <div className="profile-card__meta-item">🎓 Batch {a.graduationYear}</div>}
                                        {a.industry && <div className="profile-card__meta-item"><FiBriefcase size={12} /> {a.industry}</div>}
                                    </div>

                                    {a.domains?.length > 0 && (
                                        <div className="profile-card__tags mt-3">
                                            {a.domains.slice(0, 3).map(d => <span key={d} className="badge badge-primary">{d}</span>)}
                                        </div>
                                    )}

                                    {a.availableForMentorship && (
                                        <div style={{ marginTop: 10 }}>
                                            <span className="badge badge-success">✓ Open to Mentorship</span>
                                        </div>
                                    )}

                                    <div className="profile-card__actions">
                                        {a.availableForMentorship && user?.role === 'STUDENT' && (
                                            <button className="btn btn-primary btn-sm" style={{ flex: 1 }}
                                                onClick={() => handleMentorshipRequest(a.id)}
                                                disabled={requesting[a.id]}>
                                                {requesting[a.id] ? '...' : '🎯 Request Mentorship'}
                                            </button>
                                        )}
                                        {a.linkedinUrl && (
                                            <a href={a.linkedinUrl} target="_blank" rel="noreferrer" className="btn btn-secondary btn-icon">
                                                <FiLinkedin size={14} />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
