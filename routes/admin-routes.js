const authMiddleware = require('../middleware/auth-middleware');
const adminMiddleware = require('../middleware/admin-middleware');
const router = require('express').Router()

router.get('/welcome', authMiddleware, adminMiddleware, (req, res) => {
    res.json({'message': 'Welcome to admin page'});
});

module.exports = router