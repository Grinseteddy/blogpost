export default function RecipeCard({ recipe, onView }) {
  return (
    <div className="card recipe-card">
      {recipe.picture && (
        <img
          src={recipe.picture}
          alt={recipe.title}
          className="recipe-card-img"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      )}
      <div className="recipe-card-body">
        <h3 className="recipe-card-title">{recipe.title}</h3>
        <div className="recipe-badges">
          <span className="badge badge-meal">{recipe.meal}</span>
          <span className="badge badge-diet">{recipe.diet}</span>
        </div>
        <p className="recipe-card-meta">
          {recipe.servings} serving{recipe.servings !== 1 ? 's' : ''}
        </p>
        <button className="btn-primary btn-sm" onClick={() => onView(recipe.id)}>
          View Recipe
        </button>
      </div>
    </div>
  );
}
