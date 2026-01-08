export function ping(req, res) {
  res.status(200).json({ item: { status: 'ok', scope: 'admin' } });
}
