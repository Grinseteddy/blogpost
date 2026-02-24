import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import ErrorBanner from '../layout/ErrorBanner';
import RatingList from '../ratings/RatingList';
import RateRecipeForm from '../ratings/RateRecipeForm';
import { getRecipe, getRecipeRatings } from '../../api/client';

export default function RecipeDetail({ recipeId, onBack }) {
  const { cook } = useContext(AuthContext);
  const [recipe, setRecipe] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [recipeData, ratingsData] = await Promise.all([
        getRecipe(recipeId),
        getRecipeRatings(recipeId),
      ]);
      setRecipe(recipeData);
      setRatings(ratingsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [recipeId]);

  const canRate = cook && recipe && cook.id !== recipe.ownerId;

  return (
    <div>
      <button className="btn-back" onClick={onBack}>← Back to Recipes</button>

      {loading && <p className="loading-text">Loading recipe…</p>}
      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

      {recipe && (
        <>
          <div className="card recipe-detail">
            {recipe.picture && (
              <img
                src={recipe.picture}
                alt={recipe.title}
                className="recipe-detail-img"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            )}
            <h2>{recipe.title}</h2>
            <div className="recipe-badges">
              <span className="badge badge-meal">{recipe.meal}</span>
              <span className="badge badge-diet">{recipe.diet}</span>
              <span className="badge badge-servings">{recipe.servings} serving{recipe.servings !== 1 ? 's' : ''}</span>
            </div>

            <section className="detail-section">
              <h3>Ingredients</h3>
              <table className="ingredients-table">
                <tbody>
                  {recipe.ingredients.map((ing, idx) => (
                    <tr key={idx}>
                      <td className="ing-qty">{ing.number} {ing.unit}</td>
                      <td>{ing.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            <section className="detail-section">
              <h3>How To</h3>
              <ol className="howto-list">
                {recipe.howTo.map((step) => (
                  <li key={step.orderNo} className="howto-step">
                    <strong>{step.title}</strong>
                    <p>{step.description}</p>
                  </li>
                ))}
              </ol>
            </section>

            {recipe.shoppingList && recipe.shoppingList.length > 0 && (
              <section className="detail-section">
                <h3>Shopping List</h3>
                <ul className="shopping-list">
                  {recipe.shoppingList.map((item, idx) => (
                    <li key={idx}>
                      {item.number}× {item.product}
                      {item.link && (
                        <a href={item.link} target="_blank" rel="noreferrer" className="shopping-link"> (link)</a>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <div className="card ratings-section">
            <h3>Ratings</h3>
            <RatingList ratings={ratings} />

            {canRate && (
              <RateRecipeForm
                recipeId={recipeId}
                cookId={cook.id}
                onSuccess={fetchData}
              />
            )}
            {!cook && (
              <p className="empty-text">Register to rate this recipe.</p>
            )}
            {cook && !canRate && recipe && cook.id === recipe.ownerId && (
              <p className="empty-text">You cannot rate your own recipe.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
