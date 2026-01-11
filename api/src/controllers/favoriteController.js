import favoriteService from '../services/favoriteService.js';

export async function add(req, res, next) {
  try {
    const favorite = await favoriteService.addFavorite(req.user.id, req.params.artistId);
    res.status(200).json({ item: favorite });
  } catch (err) {
    next(err);
  }
}

export async function list(req, res, next) {
  try {
    const withArtists = req.query.withArtists !== 'false';
    const favorites = await favoriteService.listFavorites(req.user.id, { withArtists });
    res.status(200).json({ items: favorites });
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    await favoriteService.removeFavorite(req.user.id, req.params.artistId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
