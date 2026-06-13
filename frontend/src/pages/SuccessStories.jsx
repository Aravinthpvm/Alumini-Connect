import { useState, useEffect } from 'react';
import { storyService } from '../services/services';
import { useAuth } from '../context/AuthContext';
import { timeAgo, extractError } from '../utils/helpers';
import { FiHeart, FiPlus, FiStar } from 'react-icons/fi';

export default function SuccessStories() {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ title: '', story: '', advice: '', currentRole: '', company: '', achievement: '' });
    const { user } = useAuth();

    useEffect(() => {
        storyService.getAll().then(r => setStories(r.data.data || [])).catch(console.error).finally(() => setLoading(false));
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const res = await storyService.create(user.profileId, form);
            setStories(prev => [res.data.data, ...prev]);
            setShowModal(false);
            setForm({ title: '', story: '', advice: '', currentRole: '', company: '', achievement: '' });
        } catch (err) { alert(extractError(err)); }
    };

    const handleLike = async (id) => {
        if (!user) return;
        try {
            const res = await storyService.like(id, user.userId);
            setStories(ss => ss.map(s => s.id === id ? res.data.data : s));
        } catch { }
    };

    return (
        <div style={{ paddingTop: 'var(--nav-height)', minHeight: '100vh' }}>
            <div className="page-content">
                <div className="page-header">
                    <div>
                        <h1>Success Stories</h1>
                        <p>Inspiring journeys from our alumni community</p>
                    </div>
                    {user?.role === 'ALUMNI' && (
                        <button className="btn btn-primary" onClick={() => setShowModal(true)}><FiPlus /> Share Your Story</button>
                    )}
                </div>

                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><span className="spinner" /></div>
                ) : stories.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state__icon"><FiStar /></div>
                        <div className="empty-state__title">No stories yet</div>
                        <div className="empty-state__desc">Be the first alumni to share your journey</div>
                    </div>
                ) : (
                    <div className="grid grid-auto">
                        {stories.map(s => (
                            <div key={s.id} className="card" style={{ cursor: 'default' }}>
                                <div className="card-body">
                                    {s.featured && <span className="badge badge-warning" style={{ marginBottom: 12 }}>⭐ Featured</span>}
                                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 8 }}>{s.title}</h3>
                                    {(s.highlights?.currentRole || s.highlights?.company) && (
                                        <p style={{ color: 'var(--clr-primary-light)', fontSize: '0.875rem', fontWeight: 600, marginBottom: 10 }}>
                                            {s.highlights.currentRole}{s.highlights.company ? ` @ ${s.highlights.company}` : ''}
                                        </p>
                                    )}
                                    <p style={{ color: 'var(--txt-secondary)', fontSize: '0.875rem', lineHeight: 1.7 }}>
                                        {s.story?.slice(0, 200)}{s.story?.length > 200 ? '…' : ''}
                                    </p>
                                    {s.highlights?.achievement && (
                                        <div style={{ background: 'rgba(99,102,241,0.08)', borderRadius: 'var(--rad-md)', padding: '10px 14px', marginTop: 12, fontSize: '0.8125rem', color: 'var(--txt-secondary)', borderLeft: '3px solid var(--clr-primary)' }}>
                                            🏆 {s.highlights.achievement}
                                        </div>
                                    )}
                                    {s.advice && (
                                        <div style={{ marginTop: 12 }}>
                                            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--txt-muted)', marginBottom: 4 }}>Advice for students</div>
                                            <p style={{ color: 'var(--txt-secondary)', fontSize: '0.8125rem', fontStyle: 'italic', lineHeight: 1.65 }}>"{s.advice?.slice(0, 150)}{s.advice?.length > 150 ? '…' : ''}"</p>
                                        </div>
                                    )}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
                                        <span style={{ fontSize: '0.775rem', color: 'var(--txt-muted)' }}>{timeAgo(s.createdAt)}</span>
                                        <button className="btn btn-ghost btn-sm" onClick={() => handleLike(s.id)}>
                                            <FiHeart size={13} /> {s.likes || 0}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {showModal && (
                    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
                        <div className="modal">
                            <div className="modal-header">
                                <h3>Share Your Story</h3>
                                <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}>✕</button>
                            </div>
                            <form onSubmit={handleCreate}>
                                <div className="modal-body">
                                    {[['title', 'Story Title', 'text', 'How I landed my dream job at Google'], ['currentRole', 'Your Current Role', 'text', 'Senior Engineer'], ['company', 'Company', 'text', 'Google'], ['achievement', 'Achievement', 'text', 'Selected from 10,000+ applicants']].map(([n, l, t, ph]) => (
                                        <div key={n} className="form-group">
                                            <label className="form-label">{l}</label>
                                            <input type={t} className="form-control" placeholder={ph} required={n === 'title'}
                                                value={form[n]} onChange={e => setForm(f => ({ ...f, [n]: e.target.value }))} />
                                        </div>
                                    ))}
                                    <div className="form-group">
                                        <label className="form-label">Your Story</label>
                                        <textarea className="form-control" rows={5} required placeholder="Share your journey..."
                                            value={form.story} onChange={e => setForm(f => ({ ...f, story: e.target.value }))} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Advice for Students</label>
                                        <textarea className="form-control" rows={3} placeholder="What would you tell your college self?"
                                            value={form.advice} onChange={e => setForm(f => ({ ...f, advice: e.target.value }))} />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary">Publish Story</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
