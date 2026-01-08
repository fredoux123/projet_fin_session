import trackService from '../services/trackService.js';
import historyService from '../services/historyService.js';

export function list(req, res, next) {
  try {
    const tracks = trackService.listTracks(req.query);
    res.status(200).json({ items: tracks });
  } catch (err) {
    next(err);
  }
}

export function get(req, res, next) {
  try {
    const track = trackService.getTrack(req.params.id);
    res.status(200).json({ item: track });
  } catch (err) {
    next(err);
  }
}

export function create(req, res, next) {
  try {
    const track = trackService.createTrack(req.body, req.user);
    res.status(201).json({ item: track });
  } catch (err) {
    next(err);
  }
}

export function update(req, res, next) {
  try {
    const track = trackService.updateTrack(req.params.id, req.body, req.user);
    res.status(200).json({ item: track });
  } catch (err) {
    next(err);
  }
}

export function remove(req, res, next) {
  try {
    trackService.deleteTrack(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export function play(req, res, next) {
  try {
    const track = trackService.playTrack(req.params.id);
    historyService.recordPlay(req.user.id, track.id);
    res.status(200).json({ item: track });
  } catch (err) {
    next(err);
  }
}
