import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

export default function Header({ onNavigateHome }) {
  const { cook, logout } = useContext(AuthContext);

  return (
    <header className="site-header">
      <h1
        className={cook ? 'header-title clickable' : 'header-title'}
        onClick={cook ? onNavigateHome : undefined}
      >
        CookWithUs
      </h1>
      {cook && (
        <div className="header-user">
          <span>Hello, <strong>{cook.givenName}</strong>!</span>
          <button className="btn-outline" onClick={logout}>
            Log out
          </button>
        </div>
      )}
    </header>
  );
}
