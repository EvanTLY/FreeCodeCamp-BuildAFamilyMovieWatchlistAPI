// Use 'export const' instead of 'module.exports'
export const authorizeModification = (req, res, next) => {
  const user = req.user;
  const { userId } = req.params;

  if (user.role === 'parent') {
    return next();
  }

  // Use String() casting to avoid type mismatch between URL param (string) and User ID (number)
  if (user.role === 'child' && String(userId) === String(user.id)) {
    return next();
  }

  return res.status(403).json({ error: "Access denied" });
};