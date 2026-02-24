import { useState } from 'react';
import ErrorBanner from '../layout/ErrorBanner';
import { rateRecipe } from '../../api/client';

export default function RateRecipeForm({ recipeId, cookId, onSuccess }) {
  const [stars, setStars] = useState(0);
  const [note, setNote] = useState('');
  const [picture, setPicture] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (stars === 0) {
      setError('Please select a star rating.');
      return;
    }
    const body = { stars };
    if (note.trim()) body.note = note.trim();
    if (picture.trim()) body.picture = picture.trim();

    setLoading(true);
    setError(null);
    try {
      await rateRecipe(recipeId, body, cookId);
      setStars(0);
      setNote('');
      setPicture('');
      onSuccess();
    } catch (err) {
      if (err.status === 403) {
        setError('You cannot rate your own recipe.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rate-form">
      <h3>Rate this Recipe</h3>
      <ErrorBanner message={error} onDismiss={() => setError(null)} />
      <form onSubmit={handleSubmit}>
        <div className="field star-field">
          <label>Stars</label>
          <div className="star-selector" role="group" aria-label="Star rating">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                className={`star-btn ${n <= stars ? 'star-filled' : 'star-empty'}`}
                onClick={() => setStars(n)}
                aria-label={`${n} star${n !== 1 ? 's' : ''}`}
              >
                {n <= stars ? '★' : '☆'}
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <label htmlFor="note">Note <span className="optional">(optional, max 1024 chars)</span></label>
          <textarea
            id="note"
            rows={3}
            maxLength={1024}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="rating-picture">Picture URL <span className="optional">(optional)</span></label>
          <input
            id="rating-picture"
            type="url"
            value={picture}
            onChange={(e) => setPicture(e.target.value)}
            placeholder="https://…"
          />
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Submitting…' : 'Submit Rating'}
        </button>
      </form>
    </div>
  );
}
