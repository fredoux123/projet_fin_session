import favoriteService from '../services/favoriteService.js';

export function add(req, res, next) {
  try {
    const favorite = favoriteService.addFavorite(req.user.id, req.params.artistId);
    res.status(200).json({ item: favorite });
  } catch (err) {
    next(err);
  }
}

export function list(req, res, next) {
  try {
    const withArtists = req.query.withArtists !== 'false';
    const favorites = favoriteService.listFavorites(req.user.id, { withArtists });
    res.status(200).json({ items: favorites });
  } catch (err) {
    next(err);
  }
}

export function remove(req, res, next) {
  try {
    favoriteService.removeFavorite(req.user.id, req.params.artistId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
