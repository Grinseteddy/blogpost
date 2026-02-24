import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import ErrorBanner from '../layout/ErrorBanner';
import { shareRecipe } from '../../api/client';

const MEAL_OPTIONS = ['Breakfast', 'Lunch', 'Dinner', 'Dessert'];
const DIET_OPTIONS = ['Normal', 'Vegetarian', 'Vegan'];

const EMPTY_INGREDIENT = { name: '', number: '', unit: '' };
const EMPTY_STEP = { title: '', description: '' };
const EMPTY_SHOPPING_ITEM = { product: '', number: '', link: '' };

export default function ShareRecipeForm({ onSuccess, onCancel }) {
  const { cook } = useContext(AuthContext);

  const [fields, setFields] = useState({
    title: '',
    servings: '',
    meal: 'Breakfast',
    diet: 'Normal',
    picture: '',
  });

  const [ingredients, setIngredients] = useState([]);
  const [nextIngredient, setNextIngredient] = useState(EMPTY_INGREDIENT);

  const [howTo, setHowTo] = useState([]);
  const [nextStep, setNextStep] = useState(EMPTY_STEP);

  const [shoppingList, setShoppingList] = useState([]);
  const [nextShoppingItem, setNextShoppingItem] = useState(EMPTY_SHOPPING_ITEM);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const setField = (f) => (e) =>
    setFields((prev) => ({ ...prev, [f]: e.target.value }));

  // Ingredient helpers
  const addIngredient = () => {
    if (!nextIngredient.name.trim() || !nextIngredient.number.trim() || !nextIngredient.unit.trim()) {
      setError('Ingredient name, quantity, and unit are all required.');
      return;
    }
    setIngredients((prev) => [
      ...prev,
      { name: nextIngredient.name.trim(), number: nextIngredient.number.trim(), unit: nextIngredient.unit.trim() },
    ]);
    setNextIngredient(EMPTY_INGREDIENT);
  };

  const removeIngredient = (idx) =>
    setIngredients((prev) => prev.filter((_, i) => i !== idx));

  // Step helpers
  const addStep = () => {
    if (!nextStep.title.trim() || !nextStep.description.trim()) {
      setError('Step title and description are required.');
      return;
    }
    setHowTo((prev) => [
      ...prev,
      { orderNo: prev.length + 1, title: nextStep.title.trim(), description: nextStep.description.trim() },
    ]);
    setNextStep(EMPTY_STEP);
  };

  const removeStep = (idx) =>
    setHowTo((prev) =>
      prev.filter((_, i) => i !== idx).map((s, i) => ({ ...s, orderNo: i + 1 }))
    );

  // Shopping list helpers
  const addShoppingItem = () => {
    if (!nextShoppingItem.product.trim() || !nextShoppingItem.number.trim()) {
      setError('Shopping item product and quantity are required.');
      return;
    }
    const qty = parseInt(nextShoppingItem.number, 10);
    if (isNaN(qty) || qty < 1) {
      setError('Shopping item quantity must be a positive integer.');
      return;
    }
    const item = { product: nextShoppingItem.product.trim(), number: qty };
    if (nextShoppingItem.link.trim()) item.link = nextShoppingItem.link.trim();
    setShoppingList((prev) => [...prev, item]);
    setNextShoppingItem(EMPTY_SHOPPING_ITEM);
  };

  const removeShoppingItem = (idx) =>
    setShoppingList((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fields.title.trim()) { setError('Title is required.'); return; }
    const servings = parseInt(fields.servings, 10);
    if (isNaN(servings) || servings < 1) { setError('Servings must be a positive integer.'); return; }
    if (ingredients.length === 0) { setError('At least one ingredient is required.'); return; }
    if (howTo.length === 0) { setError('At least one how-to step is required.'); return; }

    const body = {
      title: fields.title.trim(),
      servings,
      meal: fields.meal,
      diet: fields.diet,
      ingredients,
      howTo,
    };
    if (shoppingList.length > 0) body.shoppingList = shoppingList;
    if (fields.picture.trim()) body.picture = fields.picture.trim();

    setLoading(true);
    setError(null);
    try {
      await shareRecipe(body, cook.id);
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card form-card">
      <h2>Share a Recipe</h2>
      <ErrorBanner message={error} onDismiss={() => setError(null)} />

      <form onSubmit={handleSubmit}>
        {/* Basic fields */}
        <div className="field">
          <label htmlFor="title">Title</label>
          <input id="title" type="text" value={fields.title} onChange={setField('title')} />
        </div>

        <div className="fields-row">
          <div className="field">
            <label htmlFor="servings">Servings</label>
            <input id="servings" type="number" min="1" value={fields.servings} onChange={setField('servings')} />
          </div>
          <div className="field">
            <label htmlFor="meal">Meal</label>
            <select id="meal" value={fields.meal} onChange={setField('meal')}>
              {MEAL_OPTIONS.map((m) => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="diet">Diet</label>
            <select id="diet" value={fields.diet} onChange={setField('diet')}>
              {DIET_OPTIONS.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
        </div>

        <div className="field">
          <label htmlFor="picture">Picture URL <span className="optional">(optional)</span></label>
          <input id="picture" type="url" value={fields.picture} onChange={setField('picture')} placeholder="https://…" />
        </div>

        {/* Ingredients */}
        <fieldset className="sub-section">
          <legend>Ingredients</legend>
          {ingredients.length > 0 && (
            <ul className="item-list">
              {ingredients.map((ing, idx) => (
                <li key={idx} className="item-row">
                  <span>{ing.number} {ing.unit} {ing.name}</span>
                  <button type="button" className="btn-remove" onClick={() => removeIngredient(idx)}>Remove</button>
                </li>
              ))}
            </ul>
          )}
          <div className="fields-row add-row">
            <input
              type="text"
              placeholder="Qty (e.g. 500)"
              value={nextIngredient.number}
              onChange={(e) => setNextIngredient((p) => ({ ...p, number: e.target.value }))}
            />
            <input
              type="text"
              placeholder="Unit (e.g. g)"
              value={nextIngredient.unit}
              onChange={(e) => setNextIngredient((p) => ({ ...p, unit: e.target.value }))}
            />
            <input
              type="text"
              placeholder="Name (e.g. Wheat Flour)"
              value={nextIngredient.name}
              onChange={(e) => setNextIngredient((p) => ({ ...p, name: e.target.value }))}
            />
            <button type="button" className="btn-add" onClick={addIngredient}>+ Add</button>
          </div>
        </fieldset>

        {/* How-to steps */}
        <fieldset className="sub-section">
          <legend>How To</legend>
          {howTo.length > 0 && (
            <ol className="item-list step-list">
              {howTo.map((step, idx) => (
                <li key={idx} className="item-row step-row">
                  <div>
                    <strong>{step.title}</strong>
                    <p className="step-desc">{step.description}</p>
                  </div>
                  <button type="button" className="btn-remove" onClick={() => removeStep(idx)}>Remove</button>
                </li>
              ))}
            </ol>
          )}
          <div className="step-add-row">
            <div className="field">
              <input
                type="text"
                placeholder="Step title"
                value={nextStep.title}
                onChange={(e) => setNextStep((p) => ({ ...p, title: e.target.value }))}
              />
            </div>
            <div className="field">
              <textarea
                placeholder="Step description"
                rows={2}
                value={nextStep.description}
                onChange={(e) => setNextStep((p) => ({ ...p, description: e.target.value }))}
              />
            </div>
            <button type="button" className="btn-add" onClick={addStep}>+ Add Step</button>
          </div>
        </fieldset>

        {/* Shopping list */}
        <fieldset className="sub-section">
          <legend>Shopping List <span className="optional">(optional)</span></legend>
          {shoppingList.length > 0 && (
            <ul className="item-list">
              {shoppingList.map((item, idx) => (
                <li key={idx} className="item-row">
                  <span>
                    {item.number}× {item.product}
                    {item.link && <a href={item.link} target="_blank" rel="noreferrer" className="shopping-link"> (link)</a>}
                  </span>
                  <button type="button" className="btn-remove" onClick={() => removeShoppingItem(idx)}>Remove</button>
                </li>
              ))}
            </ul>
          )}
          <div className="fields-row add-row">
            <input
              type="text"
              placeholder="Product"
              value={nextShoppingItem.product}
              onChange={(e) => setNextShoppingItem((p) => ({ ...p, product: e.target.value }))}
            />
            <input
              type="number"
              min="1"
              placeholder="Qty"
              value={nextShoppingItem.number}
              onChange={(e) => setNextShoppingItem((p) => ({ ...p, number: e.target.value }))}
            />
            <input
              type="url"
              placeholder="Link (optional)"
              value={nextShoppingItem.link}
              onChange={(e) => setNextShoppingItem((p) => ({ ...p, link: e.target.value }))}
            />
            <button type="button" className="btn-add" onClick={addShoppingItem}>+ Add</button>
          </div>
        </fieldset>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Sharing…' : 'Share Recipe'}
          </button>
          <button type="button" className="btn-outline" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
