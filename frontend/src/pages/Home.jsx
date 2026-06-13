import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUsers, FiBriefcase, FiCalendar, FiMessageCircle, FiArrowRight, FiAward, FiHelpCircle, FiStar } from 'react-icons/fi';

const FEATURES = [
    { icon: '🎯', title: 'Find a Mentor', desc: 'Connect with experienced alumni who can guide your career journey, provide insights, and help you navigate challenges.' },
    { icon: '💼', title: 'Discover Jobs', desc: 'Browse exclusive job opportunities posted directly by alumni working at top companies across all industries.' },
    { icon: '🌐', title: 'Network', desc: 'Build your professional network by connecting with alumni and peers in your field of interest.' },
    { icon: '📅', title: 'Events & Webinars', desc: 'Attend live events, workshops, and virtual meetups organized by alumni and the college community.' },
    { icon: '💬', title: 'Q&A Forum', desc: 'Ask questions and get answers from alumni who have been where you want to go. Real advice, real experience.' },
    { icon: '🏆', title: 'Success Stories', desc: 'Get inspired by the journeys of successful alumni who started just like you and made their mark worldwide.' },
];

const STATS = [
    { value: '5,000+', label: 'Alumni Network' },
    { value: '1,200+', label: 'Mentorships' },
    { value: '500+', label: 'Jobs Posted' },
    { value: '200+', label: 'Events Hosted' },
];

export default function Home() {
    const { user } = useAuth();

    return (
        <main>
            {/* Hero */}
            <section className="hero">
                <div className="hero__content animate-slide-up">
                    <div className="hero__eyebrow">
                        <FiStar size={13} /> The Professional Network for Your College
                    </div>

                    <h1 className="hero__title">
                        Connect with Alumni.<br />
                        <span className="gradient-text">Shape Your Future.</span>
                    </h1>

                    <p className="hero__subtitle">
                        AlumniConnect bridges the gap between students and successful alumni.
                        Find mentors, discover jobs, attend events — all in one place.
                    </p>

                    <div className="hero__cta">
                        {user ? (
                            <Link to="/dashboard" className="btn btn-primary btn-lg">
                                Go to Dashboard <FiArrowRight />
                            </Link>
                        ) : (
                            <>
                                <Link to="/register" className="btn btn-primary btn-lg">
                                    Get Started Free <FiArrowRight />
                                </Link>
                                <Link to="/alumni" className="btn btn-secondary btn-lg">
                                    Browse Alumni
                                </Link>
                            </>
                        )}
                    </div>

                    <div className="hero__stats">
                        {STATS.map(s => (
                            <div key={s.label} className="hero__stat">
                                <div className="hero__stat-value">{s.value}</div>
                                <div className="hero__stat-label">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="section" style={{ background: 'var(--clr-bg-2)' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: 48 }}>
                        <h2 className="section-title">Everything You Need to <span className="gradient-text">Succeed</span></h2>
                        <p className="section-subtitle">Powerful features designed for students and alumni alike</p>
                    </div>
                    <div className="features-grid">
                        {FEATURES.map((f) => (
                            <div key={f.title} className="feature-card">
                                <span className="feature-card__icon">{f.icon}</span>
                                <h3 className="feature-card__title">{f.title}</h3>
                                <p className="feature-card__desc">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Banner */}
            <section className="section">
                <div className="container">
                    <div style={{
                        background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(6,182,212,0.15))',
                        border: '1px solid rgba(99,102,241,0.3)',
                        borderRadius: 'var(--rad-xl)', padding: '60px 40px', textAlign: 'center'
                    }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: 12 }}>
                            Ready to <span className="gradient-text">Connect?</span>
                        </h2>
                        <p style={{ color: 'var(--txt-secondary)', marginBottom: 28, fontSize: '1.05rem' }}>
                            Join thousands of students and alumni already on the platform.
                        </p>
                        <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
                            <Link to="/register?role=student" className="btn btn-primary btn-lg">I'm a Student</Link>
                            <Link to="/register?role=alumni" className="btn btn-secondary btn-lg">I'm an Alumni</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ borderTop: '1px solid var(--clr-border)', padding: '40px 0', textAlign: 'center', background: 'var(--clr-bg-2)' }}>
                <div className="container">
                    <div style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: 8, background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>AlumniConnect</div>
                    <p style={{ color: 'var(--txt-muted)', fontSize: '0.875rem' }}>Connecting students with alumni for a brighter future.</p>
                </div>
            </footer>
        </main>
    );
}
