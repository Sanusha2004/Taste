const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  ingredients: [String],
  instructions: String,
  prepTime: String,
  cookTime: String,
  servings: String,
  category: String,
  imageUrl: String,
  likes: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Recipe', RecipeSchema);
