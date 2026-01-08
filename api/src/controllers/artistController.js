import artistService from '../services/artistService.js';

export function list(req, res, next) {
  try {
    const artists = artistService.listArtists(req.query);
    res.status(200).json({ items: artists });
  } catch (err) {
    next(err);
  }
}

export function get(req, res, next) {
  try {
    const artist = artistService.getArtist(req.params.id);
    res.status(200).json({ item: artist });
  } catch (err) {
    next(err);
  }
}

export function create(req, res, next) {
  try {
    const artist = artistService.createArtist(req.body, req.user);
    res.status(201).json({ item: artist });
  } catch (err) {
    next(err);
  }
}

export function update(req, res, next) {
  try {
    const artist = artistService.updateArtist(req.params.id, req.body, req.user);
    res.status(200).json({ item: artist });
  } catch (err) {
    next(err);
  }
}

export function remove(req, res, next) {
  try {
    artistService.deleteArtist(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
