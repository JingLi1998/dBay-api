const middlewareObj = {};

middlewareObj.jwtValidate = (req, res, next) => {
  if (Math.floor(Date.now() / 1000) > req.user.exp)
    return res.status(401).json({ error: 'Token expired' });
  next();
};
module.exports = middlewareObj;
