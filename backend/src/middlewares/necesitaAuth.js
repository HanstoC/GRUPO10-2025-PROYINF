
function necesitaAuth(req, res, next) {
  if (req.session && req.session.user)
    return next();
  else
    return res.status(401).json({ error: 'No autorizado' });
}

module.exports = necesitaAuth;