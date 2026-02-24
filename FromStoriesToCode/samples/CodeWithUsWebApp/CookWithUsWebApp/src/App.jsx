import { useState } from 'react';
import { AuthContext } from './context/AuthContext';
import Header from './components/layout/Header';
import RegisterForm from './components/auth/RegisterForm';
import RecipeList from './components/recipes/RecipeList';
import ShareRecipeForm from './components/recipes/ShareRecipeForm';
import RecipeDetail from './components/recipes/RecipeDetail';

export default function App() {
  const [cook, setCook] = useState(null);
  const [view, setView] = useState('register');
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);

  const login = (cookData) => {
    setCook(cookData);
    setView('recipes');
  };

  const logout = () => {
    setCook(null);
    setView('register');
    setSelectedRecipeId(null);
  };

  const navigate = (target, recipeId = null) => {
    setSelectedRecipeId(recipeId);
    setView(target);
  };

  return (
    <AuthContext.Provider value={{ cook, login, logout }}>
      <Header onNavigateHome={() => navigate('recipes')} />
      <main className="container">
        {view === 'register' && <RegisterForm />}
        {view === 'recipes' && (
          <RecipeList
            onSelectRecipe={(id) => navigate('recipeDetail', id)}
            onShareRecipe={() => navigate('share')}
          />
        )}
        {view === 'share' && (
          <ShareRecipeForm
            onSuccess={() => navigate('recipes')}
            onCancel={() => navigate('recipes')}
          />
        )}
        {view === 'recipeDetail' && (
          <RecipeDetail
            recipeId={selectedRecipeId}
            onBack={() => navigate('recipes')}
          />
        )}
      </main>
    </AuthContext.Provider>
  );
}
