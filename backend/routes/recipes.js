const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 });
    res.json(recipes);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    res.json(recipe);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, description, ingredients, instructions, prepTime, cookTime, servings, category } = req.body;
    const newRecipe = new Recipe({
      title,
      description,
      ingredients: ingredients.split(',').map(i => i.trim()),
      instructions,
      prepTime,
      cookTime,
      servings,
      category,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : '',
    });
    await newRecipe.save();
    res.status(201).json(newRecipe);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:id/like', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    recipe.likes++;
    await recipe.save();
    res.json({ likes: recipe.likes });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
