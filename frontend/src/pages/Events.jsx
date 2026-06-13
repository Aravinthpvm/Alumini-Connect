import { useState, useEffect } from 'react';
import { eventService } from '../services/services';
import { useAuth } from '../context/AuthContext';
import { formatDate, statusColor, extractError } from '../utils/helpers';
import { FiCalendar, FiMapPin, FiUsers, FiPlus, FiClock, FiVideo, FiSearch } from 'react-icons/fi';

const EVENT_ICONS = { WEBINAR: '🎙️', MEETUP: '🤝', WORKSHOP: '⚙️', CAMPUS_VISIT: '🏫', NETWORKING: '🌐' };

export default function Events() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ eventType: 'WEBINAR', mode: 'ONLINE' });
    const [search, setSearch] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        eventService.getAll().then(r => setEvents(r.data.data || [])).catch(console.error).finally(() => setLoading(false));
    }, []);

    const filtered = events.filter(e =>
        !search || e.eventTitle?.toLowerCase().includes(search.toLowerCase())
    );

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const res = await eventService.create(user.profileId, user.role, form);
            setEvents(prev => [res.data.data, ...prev]);
            setShowModal(false);
            setForm({ eventType: 'WEBINAR', mode: 'ONLINE' });
        } catch (err) { alert(extractError(err)); }
    };

    const handleRegister = async (eventId) => {
        if (!user) { alert('Please login to register'); return; }
        try {
            await eventService.register(eventId, user.profileId, user.role);
            alert('Registered successfully!');
        } catch (err) { alert(extractError(err)); }
    };

    return (
        <div style={{ paddingTop: 'var(--nav-height)', minHeight: '100vh' }}>
            <div className="page-content">
                <div className="page-header">
                    <div>
                        <h1>Events</h1>
                        <p>Webinars, meetups, workshops organized by alumni</p>
                    </div>
                    {(user?.role === 'ALUMNI' || user?.role === 'ADMIN') && (
                        <button className="btn btn-primary" onClick={() => setShowModal(true)}><FiPlus /> Create Event</button>
                    )}
                </div>

                <div style={{ marginBottom: 24 }}>
                    <div className="search-bar">
                        <span className="search-icon"><FiSearch /></span>
                        <input placeholder="Search events..." value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                </div>

                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><span className="spinner" /></div>
                ) : filtered.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state__icon"><FiCalendar /></div>
                        <div className="empty-state__title">No events yet</div>
                        <div className="empty-state__desc">Check back soon for upcoming events</div>
                    </div>
                ) : (
                    <div className="grid grid-3">
                        {filtered.map(ev => (
                            <div key={ev.id} className="event-card">
                                <div className="event-card__banner">
                                    {EVENT_ICONS[ev.eventType] || '📅'}
                                    <div className="event-card__badge"><span className={`badge badge-${statusColor(ev.status)}`}>{ev.status}</span></div>
                                </div>
                                <div className="event-card__body">
                                    <span className="badge badge-ghost" style={{ marginBottom: 8 }}>{ev.eventType?.replace('_', ' ')}</span>
                                    <div className="event-card__title">{ev.eventTitle}</div>
                                    <div className="event-card__meta mt-2">
                                        {ev.eventDate && <div className="event-card__meta-item"><FiCalendar size={12} />{formatDate(ev.eventDate)}</div>}
                                        {ev.startTime && <div className="event-card__meta-item"><FiClock size={12} />{ev.startTime} — {ev.endTime}</div>}
                                        <div className="event-card__meta-item">
                                            {ev.mode === 'ONLINE' ? <FiVideo size={12} /> : <FiMapPin size={12} />}
                                            {ev.mode === 'ONLINE' ? 'Online' : ev.venue}
                                        </div>
                                        {ev.speakerName && <div className="event-card__meta-item">🎤 {ev.speakerName}{ev.speakerDesignation ? `, ${ev.speakerDesignation}` : ''}</div>}
                                    </div>
                                    {ev.topics?.length > 0 && (
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 10 }}>
                                            {ev.topics.slice(0, 3).map(t => <span key={t} className="badge badge-info">{t}</span>)}
                                        </div>
                                    )}
                                </div>
                                <div className="event-card__footer">
                                    <span style={{ fontSize: '0.8125rem', color: 'var(--txt-muted)' }}>
                                        <FiUsers size={12} /> {ev.currentCount || 0}{ev.maxParticipants ? `/${ev.maxParticipants}` : ''} registered
                                    </span>
                                    {ev.status === 'UPCOMING' && (
                                        <button className="btn btn-primary btn-sm" onClick={() => handleRegister(ev.id)}>Register</button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {showModal && (
                    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
                        <div className="modal">
                            <div className="modal-header">
                                <h3>Create Event</h3>
                                <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}>✕</button>
                            </div>
                            <form onSubmit={handleCreate}>
                                <div className="modal-body">
                                    {[['eventTitle', 'Event Title', 'text', 'System Design Workshop'], ['speakerName', 'Speaker Name', 'text', ''], ['speakerDesignation', 'Speaker Designation', 'text', 'Senior Engineer @ Google']].map(([n, l, t, ph]) => (
                                        <div key={n} className="form-group">
                                            <label className="form-label">{l}</label>
                                            <input type={t} className="form-control" placeholder={ph} required={n === 'eventTitle'}
                                                value={form[n] || ''} onChange={e => setForm(f => ({ ...f, [n]: e.target.value }))} />
                                        </div>
                                    ))}
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                                        <div className="form-group">
                                            <label className="form-label">Event Type</label>
                                            <select className="form-control" value={form.eventType} onChange={e => setForm(f => ({ ...f, eventType: e.target.value }))}>
                                                {['WEBINAR', 'MEETUP', 'WORKSHOP', 'CAMPUS_VISIT', 'NETWORKING'].map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Mode</label>
                                            <select className="form-control" value={form.mode} onChange={e => setForm(f => ({ ...f, mode: e.target.value }))}>
                                                <option value="ONLINE">Online</option><option value="OFFLINE">Offline</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Date</label>
                                            <input type="datetime-local" className="form-control"
                                                value={form.eventDate || ''} onChange={e => setForm(f => ({ ...f, eventDate: e.target.value }))} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Max Participants</label>
                                            <input type="number" className="form-control" placeholder="100"
                                                value={form.maxParticipants || ''} onChange={e => setForm(f => ({ ...f, maxParticipants: e.target.value }))} />
                                        </div>
                                    </div>
                                    {form.mode === 'ONLINE'
                                        ? <div className="form-group"><label className="form-label">Meeting Link</label><input className="form-control" placeholder="https://meet.google.com/..." value={form.meetingLink || ''} onChange={e => setForm(f => ({ ...f, meetingLink: e.target.value }))} /></div>
                                        : <div className="form-group"><label className="form-label">Venue</label><input className="form-control" value={form.venue || ''} onChange={e => setForm(f => ({ ...f, venue: e.target.value }))} /></div>
                                    }
                                    <div className="form-group">
                                        <label className="form-label">Description</label>
                                        <textarea className="form-control" rows={3} value={form.description || ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary">Create Event</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
