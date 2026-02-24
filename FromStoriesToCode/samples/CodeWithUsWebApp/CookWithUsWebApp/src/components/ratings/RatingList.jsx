function Stars({ count }) {
  return (
    <span className="stars" aria-label={`${count} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= count ? 'star-filled' : 'star-empty'}>
          {n <= count ? '★' : '☆'}
        </span>
      ))}
    </span>
  );
}

export default function RatingList({ ratings }) {
  if (!ratings || ratings.length === 0) {
    return <p className="empty-text">No ratings yet.</p>;
  }

  return (
    <ul className="rating-list">
      {ratings.map((rating) => (
        <li key={rating.id} className="rating-item">
          <Stars count={rating.stars} />
          {rating.note && <p className="rating-note">{rating.note}</p>}
          {rating.picture && (
            <img
              src={rating.picture}
              alt="Rating photo"
              className="rating-img"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          )}
        </li>
      ))}
    </ul>
  );
}
