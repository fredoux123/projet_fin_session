import trackService from '../services/trackService.js';
import historyService from '../services/historyService.js';

export async function list(req, res, next) {
  try {
    const tracks = await trackService.listTracks(req.query);
    res.status(200).json({ items: tracks });
  } catch (err) {
    next(err);
  }
}

export async function get(req, res, next) {
  try {
    const track = await trackService.getTrack(req.params.id);
    res.status(200).json({ item: track });
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const track = await trackService.createTrack(req.body, req.user);
    res.status(201).json({ item: track });
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const track = await trackService.updateTrack(req.params.id, req.body, req.user);
    res.status(200).json({ item: track });
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    await trackService.deleteTrack(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function play(req, res, next) {
  try {
    const track = await trackService.playTrack(req.params.id);
    await historyService.recordPlay(req.user.id, track.id);
    res.status(200).json({ item: track });
  } catch (err) {
    next(err);
  }
}
