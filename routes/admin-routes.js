const router = require('express').Router();
const authMiddleware = require('../middleware/auth-middleware')
const isAdminUser = require('../middleware/admin-middleware');


router.get('/', authMiddleware, isAdminUser, (req, res) => {
  res.json({
    message: 'Admin Page'
  })
})

module.exports = router;