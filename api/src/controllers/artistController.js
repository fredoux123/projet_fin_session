import artistService from '../services/artistService.js';

export async function list(req, res, next) {
  try {
    const artists = await artistService.listArtists(req.query);
    res.status(200).json({ items: artists });
  } catch (err) {
    next(err);
  }
}

export async function get(req, res, next) {
  try {
    const artist = await artistService.getArtist(req.params.id);
    res.status(200).json({ item: artist });
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const artist = await artistService.createArtist(req.body, req.user);
    res.status(201).json({ item: artist });
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const artist = await artistService.updateArtist(req.params.id, req.body, req.user);
    res.status(200).json({ item: artist });
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    await artistService.deleteArtist(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
