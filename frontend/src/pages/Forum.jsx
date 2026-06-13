import { useState, useEffect } from 'react';
import { forumService } from '../services/services';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { timeAgo, extractError } from '../utils/helpers';
import { FiSearch, FiPlus, FiThumbsUp, FiEye, FiMessageCircle, FiCheckCircle } from 'react-icons/fi';

const CATEGORIES = ['CAREER', 'TECHNICAL', 'COLLEGE_LIFE', 'INTERNSHIP', 'PLACEMENT', 'GENERAL'];

export default function Forum() {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [cat, setCat] = useState('');
    const [search, setSearch] = useState('');
    const [showAsk, setShowAsk] = useState(false);
    const [activeQ, setActiveQ] = useState(null);
    const [qForm, setQForm] = useState({ title: '', description: '', category: 'CAREER', tags: '' });
    const [aForm, setAForm] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        forumService.getQuestions(cat).then(r => setQuestions(r.data.data || [])).finally(() => setLoading(false));
    }, [cat]);

    const filtered = questions.filter(q => !search || q.title?.toLowerCase().includes(search.toLowerCase()));

    const loadAnswers = async (qId) => {
        if (activeQ === qId) { setActiveQ(null); return; }
        try {
            const res = await forumService.getAnswers(qId);
            setAnswers(a => ({ ...a, [qId]: res.data.data || [] }));
            setActiveQ(qId);
        } catch { }
    };

    const handleAsk = async (e) => {
        e.preventDefault();
        if (!user) { navigate('/login'); return; }
        try {
            const tags = qForm.tags.split(',').map(t => t.trim()).filter(Boolean);
            const res = await forumService.createQuestion(user.userId, user.role, { ...qForm, tags });
            setQuestions(prev => [res.data.data, ...prev]);
            setShowAsk(false);
            setQForm({ title: '', description: '', category: 'CAREER', tags: '' });
        } catch (err) { alert(extractError(err)); }
    };

    const handleAnswer = async (qId) => {
        if (!aForm.trim()) return;
        try {
            const res = await forumService.addAnswer(qId, user.userId, user.role, { content: aForm });
            setAnswers(a => ({ ...a, [qId]: [...(a[qId] || []), res.data.data] }));
            setAForm('');
            setQuestions(qs => qs.map(q => q.id === qId ? { ...q, answers: (q.answers || 0) + 1 } : q));
        } catch (err) { alert(extractError(err)); }
    };

    const handleUpvote = async (answerId, qId) => {
        if (!user) return;
        try {
            await forumService.upvoteAnswer(answerId, user.userId);
            setAnswers(a => ({
                ...a,
                [qId]: (a[qId] || []).map(ans => ans.id === answerId ? { ...ans, upvotes: (ans.upvotes || 0) + 1 } : ans)
            }));
        } catch { }
    };

    return (
        <div style={{ paddingTop: 'var(--nav-height)', minHeight: '100vh' }}>
            <div className="page-content">
                <div className="page-header">
                    <div>
                        <h1>Q&A Forum</h1>
                        <p>Ask questions, share knowledge, get answers from alumni</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => setShowAsk(true)}><FiPlus /> Ask Question</button>
                </div>

                {/* Category filter */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                    <button className={`btn btn-sm ${cat === '' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setCat('')}>All</button>
                    {CATEGORIES.map(c => (
                        <button key={c} className={`btn btn-sm ${cat === c ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setCat(c)}>{c.replace('_', ' ')}</button>
                    ))}
                </div>

                <div className="search-bar" style={{ marginBottom: 24 }}>
                    <span className="search-icon"><FiSearch /></span>
                    <input placeholder="Search questions..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>

                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><span className="spinner" /></div>
                ) : filtered.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state__icon"><FiMessageCircle /></div>
                        <div className="empty-state__title">No questions yet</div>
                        <div className="empty-state__desc">Be the first to ask!</div>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {filtered.map(q => (
                            <div key={q.id} className="question-card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                                    <div>
                                        {q.isSolved && <span className="badge badge-success" style={{ marginBottom: 8 }}>✓ Solved</span>}
                                        <div className="question-card__title" onClick={() => loadAnswers(q.id)}>
                                            {q.title}
                                        </div>
                                        {q.description && <p style={{ color: 'var(--txt-secondary)', fontSize: '0.875rem', marginTop: 6, lineHeight: 1.6 }}>{q.description?.slice(0, 180)}{q.description?.length > 180 ? '…' : ''}</p>}
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 8 }}>
                                            <span className="badge badge-ghost">{q.category?.replace('_', ' ')}</span>
                                            {q.tags?.slice(0, 3).map(t => <span key={t} className="badge badge-primary">{t}</span>)}
                                        </div>
                                    </div>
                                </div>
                                <div className="question-card__meta">
                                    <span className="question-card__meta-item"><FiMessageCircle size={12} /> {q.answers || 0} answers</span>
                                    <span className="question-card__meta-item"><FiEye size={12} /> {q.views || 0} views</span>
                                    <span className="question-card__meta-item">🕒 {timeAgo(q.createdAt)}</span>
                                    <span className="question-card__meta-item">by {q.askerType}</span>
                                    <button className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto', fontSize: '0.8rem' }} onClick={() => loadAnswers(q.id)}>
                                        {activeQ === q.id ? 'Hide' : 'Show'} Answers
                                    </button>
                                </div>

                                {/* Answers section */}
                                {activeQ === q.id && (
                                    <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--clr-border)' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                            {(answers[q.id] || []).length === 0
                                                ? <p style={{ color: 'var(--txt-muted)', fontSize: '0.875rem' }}>No answers yet. Be the first!</p>
                                                : (answers[q.id] || []).map(a => (
                                                    <div key={a.id} style={{ background: 'var(--clr-bg-3)', borderRadius: 'var(--rad-md)', padding: '14px 16px', position: 'relative' }}>
                                                        {a.isBestAnswer && <span className="badge badge-success" style={{ marginBottom: 8 }}>⭐ Best Answer</span>}
                                                        <p style={{ color: 'var(--txt-secondary)', lineHeight: 1.7, fontSize: '0.9rem' }}>{a.content}</p>
                                                        <div style={{ display: 'flex', gap: 10, marginTop: 10, alignItems: 'center' }}>
                                                            <button className="btn btn-ghost btn-sm" onClick={() => handleUpvote(a.id, q.id)}>
                                                                <FiThumbsUp size={12} /> {a.upvotes || 0}
                                                            </button>
                                                            <span style={{ fontSize: '0.775rem', color: 'var(--txt-muted)' }}>{timeAgo(a.createdAt)} by {a.answererType}</span>
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                        {user && (
                                            <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                                                <input className="form-control" placeholder="Write your answer..."
                                                    value={aForm} onChange={e => setAForm(e.target.value)} />
                                                <button className="btn btn-primary btn-sm" onClick={() => handleAnswer(q.id)}>Post</button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {showAsk && (
                    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowAsk(false)}>
                        <div className="modal">
                            <div className="modal-header">
                                <h3>Ask a Question</h3>
                                <button className="btn btn-ghost btn-icon" onClick={() => setShowAsk(false)}>✕</button>
                            </div>
                            <form onSubmit={handleAsk}>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label className="form-label">Question Title</label>
                                        <input className="form-control" required placeholder="What's your question?"
                                            value={qForm.title} onChange={e => setQForm(f => ({ ...f, title: e.target.value }))} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Description</label>
                                        <textarea className="form-control" rows={4} placeholder="Provide more context..."
                                            value={qForm.description} onChange={e => setQForm(f => ({ ...f, description: e.target.value }))} />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                                        <div className="form-group">
                                            <label className="form-label">Category</label>
                                            <select className="form-control" value={qForm.category} onChange={e => setQForm(f => ({ ...f, category: e.target.value }))}>
                                                {CATEGORIES.map(c => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Tags (comma separated)</label>
                                            <input className="form-control" placeholder="React, Internship, Resume"
                                                value={qForm.tags} onChange={e => setQForm(f => ({ ...f, tags: e.target.value }))} />
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-ghost" onClick={() => setShowAsk(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary">Post Question</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
