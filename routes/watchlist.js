import express from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { authorizeModification } from '../middleware/authorize.js';
import { getWatchlist, addMovie, updateMovie, deleteMovie } from '../utils/db.js';

const router = express.Router();

// All routes here require a valid token
router.use(authenticate);

// GET: Any authenticated user can view any list
router.get('/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);
  const list = getWatchlist(userId);
  
  if (list === null) {
    return res.status(404).json({ error: "User not found" });
  }
  
  return res.status(200).json(list);
});

// POST: Add movie (Requires Authorization)
router.post('/:userId/movies', authorizeModification, (req, res) => {
  const userId = parseInt(req.params.userId);
  const movie = addMovie(userId, req.body);
  
  if (!movie) {
    return res.status(404).json({ error: "User not found" });
  }
  
  return res.status(201).json(movie);
});

// PUT: Update movie (Requires Authorization)
router.put('/:userId/movies/:movieId', authorizeModification, (req, res) => {
  const userId = parseInt(req.params.userId);
  const movieId = parseInt(req.params.movieId);
  const updated = updateMovie(userId, movieId, req.body);
  
  if (!updated) {
    return res.status(404).json({ error: "Movie not found" });
  }
  
  return res.status(200).json(updated);
});

// DELETE: Remove movie (Requires Authorization)
router.delete('/:userId/movies/:movieId', authorizeModification, (req, res) => {
  const userId = parseInt(req.params.userId);
  const movieId = parseInt(req.params.movieId);
  const success = deleteMovie(userId, movieId);
  
  if (!success) {
    return res.status(404).json({ error: "Movie not found" });
  }
  
  return res.status(200).json({ message: "Removed successfully" });
});

export default router;