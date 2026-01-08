export function ping(req, res) {
  res.status(200).json({ status: 'ok', scope: 'admin' });
}
