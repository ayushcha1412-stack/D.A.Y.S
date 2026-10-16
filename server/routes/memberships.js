const router = require('express').Router();
const { body } = require('express-validator');
const ctrl   = require('../controllers/membershipController');
const { adminOnly } = require('../middleware/auth');
const validate = require('../middleware/validate');

// Public: register
router.post('/',
  body('name').notEmpty().withMessage('Name is required.'),
  body('phone').matches(/^\d{10}$/).withMessage('Valid 10-digit phone required.'),
  body('age').isInt({ min: 5, max: 110 }).withMessage('Valid age required.'),
  body('level').notEmpty().withMessage('Experience level is required.'),
  body('mode').notEmpty().withMessage('Preferred mode is required.'),
  body('membershipType').isIn(['annual', 'monthly', 'trial']).withMessage('Valid membership type required.'),
  validate,
  ctrl.create
);

// Admin
router.get('/',        adminOnly, ctrl.getAll);
router.get('/:id',     adminOnly, ctrl.getOne);
router.put('/:id',     adminOnly, ctrl.update);
router.delete('/:id',  adminOnly, ctrl.remove);

module.exports = router;
