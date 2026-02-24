import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useApi } from '../../hooks/useApi';
import { getRecipes } from '../../api/client';
import RecipeCard from './RecipeCard';
import ErrorBanner from '../layout/ErrorBanner';

export default function RecipeList({ onSelectRecipe, onShareRecipe }) {
  const { cook } = useContext(AuthContext);
  const { data: recipes, loading, error } = useApi(getRecipes, []);

  return (
    <div>
      <div className="list-header">
        <h2>Recipes</h2>
        {cook && (
          <button className="btn-primary" onClick={onShareRecipe}>
            + Share a Recipe
          </button>
        )}
      </div>

      {error && <ErrorBanner message={error} onDismiss={() => {}} />}

      {loading && <p className="loading-text">Loading recipes…</p>}

      {!loading && !error && recipes && recipes.length === 0 && (
        <p className="empty-text">No recipes yet. Be the first to share one!</p>
      )}

      {!loading && recipes && recipes.length > 0 && (
        <div className="recipe-grid">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onView={onSelectRecipe}
            />
          ))}
        </div>
      )}
    </div>
  );
}
