import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import ErrorBanner from '../layout/ErrorBanner';
import { registerCook } from '../../api/client';

export default function RegisterForm() {
  const { login } = useContext(AuthContext);
  const [fields, setFields] = useState({ givenName: '', name: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const set = (field) => (e) =>
    setFields((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fields.givenName.trim() || !fields.name.trim() || !fields.email.trim()) {
      setError('First name, last name, and email are required.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const cook = await registerCook({
        givenName: fields.givenName.trim(),
        name: fields.name.trim(),
        email: fields.email.trim(),
      });
      login(cook);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card form-card">
      <h2>Join CookWithUs</h2>
      <p className="subtitle">Register to share and rate recipes.</p>
      <ErrorBanner message={error} onDismiss={() => setError(null)} />
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="givenName">First Name</label>
          <input
            id="givenName"
            type="text"
            value={fields.givenName}
            onChange={set('givenName')}
            autoComplete="given-name"
          />
        </div>
        <div className="field">
          <label htmlFor="name">Last Name</label>
          <input
            id="name"
            type="text"
            value={fields.name}
            onChange={set('name')}
            autoComplete="family-name"
          />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={fields.email}
            onChange={set('email')}
            autoComplete="email"
          />
        </div>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Registering…' : 'Register'}
        </button>
      </form>
    </div>
  );
}
