const router = require('express').Router();
const { body } = require('express-validator');
const ctrl   = require('../controllers/reviewController');
const { adminOnly, optionalAuth } = require('../middleware/auth');
const validate = require('../middleware/validate');

// optionalAuth: unauthenticated requests get approved reviews only;
// admin token → req.role === 'admin' → all reviews returned
router.get('/',              optionalAuth, ctrl.getAll);
router.post('/',
  body('name').notEmpty().withMessage('Name is required.'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be 1–5.'),
  body('review').isLength({ min: 10 }).withMessage('Review must be at least 10 characters.'),
  validate,
  ctrl.create
);
router.put('/:id/approve',   adminOnly, ctrl.approve);
router.put('/:id',           adminOnly, ctrl.update);
router.delete('/:id',        adminOnly, ctrl.remove);

module.exports = router;
