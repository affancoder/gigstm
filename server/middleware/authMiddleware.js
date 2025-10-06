const supabase = require('../config/supabaseClient');

const authMiddleware = async (req, res, next) => {
  const token = req.cookies['sb-access-token'];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided.' });
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token.' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

module.exports = authMiddleware;
