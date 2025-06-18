const API_URL = 'http://localhost:5000/recipes';

const postsEl = document.getElementById('posts');
const searchInput = document.getElementById('search');
const addRecipeBtn = document.getElementById('addRecipeBtn');

async function fetchRecipes(query = '') {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    let filtered = data;
    if (query) {
      filtered = data.filter(recipe => recipe.title.toLowerCase().includes(query.toLowerCase()));
    }
    displayRecipes(filtered);
  } catch (err) {
    postsEl.innerHTML = `<p>Failed to load recipes.</p>`;
  }
}

function displayRecipes(recipes) {
  postsEl.innerHTML = '';
  if (recipes.length === 0) {
    postsEl.innerHTML = '<p>No recipes found.</p>';
    return;
  }
  recipes.forEach(recipe => {
    const card = document.createElement('div');
    card.className = 'recipe-card';
    card.innerHTML = `
      <img src="${recipe.imageUrl || 'https://source.unsplash.com/300x200/?food'}" alt="${recipe.title}">
      <div class="recipe-content">
        <h3>${recipe.title}</h3>
        <p>${recipe.description}</p>
        <button class="like-btn">❤️ <span>${recipe.likes}</span></button>
      </div>
    `;
    card.querySelector('.like-btn').addEventListener('click', async e => {
      e.stopPropagation();
      await likeRecipe(recipe._id, card);
    });
    card.addEventListener('click', () => {
      window.location.href = `recipe.html?id=${recipe._id}`;
    });
    postsEl.appendChild(card);
  });
}

async function likeRecipe(id, card) {
  try {
    const res = await fetch(`${API_URL}/${id}/like`, { method: 'POST' });
    const data = await res.json();
    const span = card.querySelector('.like-btn span');
    span.textContent = data.likes;
  } catch (err) {
    alert('Failed to like recipe');
  }
}

searchInput.addEventListener('input', () => {
  fetchRecipes(searchInput.value);
});

addRecipeBtn.addEventListener('click', () => {
  window.location.href = 'add-recipe.html';
});

// Initial load
fetchRecipes();
