import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/services';
import { extractError } from '../utils/helpers';

const studentFields = [
    { name: 'fullName', label: 'Full Name', type: 'text', placeholder: 'Arjun Kumar' },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'arjun@college.edu' },
    { name: 'password', label: 'Password', type: 'password', placeholder: 'Min. 6 characters' },
    { name: 'phoneNumber', label: 'Phone', type: 'tel', placeholder: '+91 98765 43210' },
    { name: 'rollNumber', label: 'Roll Number', type: 'text', placeholder: 'CS2021001' },
    { name: 'branch', label: 'Branch', type: 'select', options: ['CSE', 'ECE', 'MECH', 'CIVIL', 'EEE', 'IT', 'OTHER'] },
    { name: 'currentYear', label: 'Current Year', type: 'select', options: ['1', '2', '3', '4'] },
    { name: 'graduationYear', label: 'Graduation Year', type: 'number', placeholder: '2025' },
];

const alumniFields = [
    { name: 'fullName', label: 'Full Name', type: 'text', placeholder: 'Priya Sharma' },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'priya@company.com' },
    { name: 'password', label: 'Password', type: 'password', placeholder: 'Min. 6 characters' },
    { name: 'phoneNumber', label: 'Phone', type: 'tel', placeholder: '+91 98765 43210' },
    { name: 'branch', label: 'Branch', type: 'select', options: ['CSE', 'ECE', 'MECH', 'CIVIL', 'EEE', 'IT', 'OTHER'] },
    { name: 'graduationYear', label: 'Graduation Year', type: 'number', placeholder: '2020' },
    { name: 'currentCompany', label: 'Current Company', type: 'text', placeholder: 'Google, Microsoft...' },
    { name: 'currentPosition', label: 'Current Position', type: 'text', placeholder: 'Software Engineer' },
    { name: 'industry', label: 'Industry', type: 'select', options: ['Tech', 'Finance', 'Consulting', 'Healthcare', 'Education', 'Startup', 'Other'] },
    { name: 'location', label: 'Location', type: 'text', placeholder: 'Bangalore, India' },
];

export default function Register() {
    const [params] = useSearchParams();
    const defaultRole = params.get('role') === 'alumni' ? 'alumni' : 'student';
    const [role, setRole] = useState(defaultRole);
    const [form, setForm] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setLoading(true);
        try {
            const data = role === 'student'
                ? { ...form, currentYear: parseInt(form.currentYear), graduationYear: parseInt(form.graduationYear) }
                : { ...form, graduationYear: parseInt(form.graduationYear), yearsOfExperience: parseInt(form.yearsOfExperience || 0) };
            const res = role === 'student'
                ? await authService.registerStudent(data)
                : await authService.registerAlumni(data);
            login(res.data.data);
            navigate('/dashboard');
        } catch (err) {
            setError(extractError(err));
        } finally {
            setLoading(false);
        }
    };

    const fields = role === 'student' ? studentFields : alumniFields;

    return (
        <div className="auth-page">
            <div className="auth-card" style={{ maxWidth: 520 }}>
                <div className="auth-card__inner">
                    <div className="auth-logo">
                        <img src="/alumni-connect-logo.png" alt="" className="auth-logo__image" />
                        <h1>AlumniConnect</h1>
                        <p>Join the network. Shape your future.</p>
                    </div>

                    <div className="auth-tabs">
                        <div className={`auth-tab ${role === 'student' ? 'active' : ''}`} onClick={() => { setRole('student'); setForm({}); }}>
                            🎓 Student
                        </div>
                        <div className={`auth-tab ${role === 'alumni' ? 'active' : ''}`} onClick={() => { setRole('alumni'); setForm({}); }}>
                            👔 Alumni
                        </div>
                    </div>

                    {error && (
                        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--rad-md)', padding: '12px 16px', color: 'var(--clr-danger)', fontSize: '0.875rem', marginBottom: 20 }}>
                            {error}
                        </div>
                    )}

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                            {fields.map(f => (
                                <div key={f.name} className="form-group" style={{ gridColumn: ['fullName', 'email', 'password'].includes(f.name) ? '1/-1' : 'auto' }}>
                                    <label className="form-label">{f.label}</label>
                                    {f.type === 'select' ? (
                                        <select name={f.name} className="form-control" value={form[f.name] || ''} onChange={handleChange} required>
                                            <option value="">Select {f.label}</option>
                                            {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                                        </select>
                                    ) : (
                                        <input name={f.name} type={f.type} placeholder={f.placeholder}
                                            value={form[f.name] || ''} onChange={handleChange}
                                            required className="form-control" />
                                    )}
                                </div>
                            ))}
                        </div>

                        {role === 'alumni' && (
                            <p style={{ fontSize: '0.8125rem', color: 'var(--txt-muted)', marginTop: 4 }}>
                                📋 Your account will be reviewed and verified by admin before full access is granted.
                            </p>
                        )}

                        <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                            {loading ? <span className="spinner" style={{ width: 18, height: 18 }} /> : `Create ${role === 'student' ? 'Student' : 'Alumni'} Account`}
                        </button>
                    </form>

                    <div className="auth-footer">
                        Already have an account? <Link to="/login">Sign in</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
