const router  = require('express').Router();
const { body } = require('express-validator');
const ctrl     = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

// Admin login
router.post('/admin/login',
  body('email').isEmail().withMessage('Valid email required.'),
  body('password').notEmpty().withMessage('Password required.'),
  validate,
  ctrl.adminLogin
);

// User register
router.post('/register',
  body('name').notEmpty().withMessage('Name required.'),
  body('phone').matches(/^\d{10}$/).withMessage('Valid 10-digit phone required.'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
  validate,
  ctrl.register
);

// User login
router.post('/login',
  body('phone').matches(/^\d{10}$/).withMessage('Valid 10-digit phone required.'),
  body('password').notEmpty().withMessage('Password required.'),
  validate,
  ctrl.login
);

// Get current user
router.get('/me', protect, ctrl.getMe);

module.exports = router;
