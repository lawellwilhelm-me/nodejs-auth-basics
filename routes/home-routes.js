const router = require('express').Router()
const authMiddleware = require('../middleware/auth-middleware')


router.get('/', authMiddleware, (req, res) => {
  const { username, userId, role } = req.userInfo;

  res.json({
    message: 'Welcome to our Homepage',
    user: {
      _id: userId,
      username,
      role,
    }
  })
});

module.exports = router;