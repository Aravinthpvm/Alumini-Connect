import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/services';
import { extractError } from '../utils/helpers';
import { FiMail, FiLock, FiStar } from 'react-icons/fi';

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await authService.loginUser(form);
            login(res.data.data);
            navigate('/dashboard');
        } catch (err) {
            setError(extractError(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-card__inner">
                    <div className="auth-logo">
                        <h1><FiStar style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }} />AlumniConnect</h1>
                        <p>Welcome back! Sign in to your account</p>
                    </div>

                    {error && (
                        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--rad-md)', padding: '12px 16px', color: 'var(--clr-danger)', fontSize: '0.875rem', marginBottom: 20 }}>
                            {error}
                        </div>
                    )}

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <div className="search-bar">
                                <span className="search-icon"><FiMail /></span>
                                <input name="email" type="email" placeholder="you@university.edu" value={form.email}
                                    onChange={handleChange} required className="form-control" style={{ border: 'none', background: 'transparent' }} />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <div className="search-bar">
                                <span className="search-icon"><FiLock /></span>
                                <input name="password" type="password" placeholder="Your password" value={form.password}
                                    onChange={handleChange} required className="form-control" style={{ border: 'none', background: 'transparent' }} />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary w-full" disabled={loading} style={{ marginTop: 4 }}>
                            {loading ? <span className="spinner" style={{ width: 18, height: 18 }} /> : 'Sign In'}
                        </button>
                    </form>

                    <div className="auth-footer">
                        Don't have an account? <Link to="/register">Create one</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
