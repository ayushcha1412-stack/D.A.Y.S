const router = require('express').Router();
const { body } = require('express-validator');
const ctrl   = require('../controllers/enquiryController');
const { adminOnly } = require('../middleware/auth');
const validate = require('../middleware/validate');

// Public: submit
router.post('/',
  body('name').notEmpty().withMessage('Name is required.'),
  body('phone').matches(/^\d{10}$/).withMessage('Valid 10-digit phone required.'),
  body('email').optional({ checkFalsy: true }).isEmail().withMessage('Valid email required.'),
  body('service').notEmpty().withMessage('Service is required.'),
  body('message').isLength({ min: 5 }).withMessage('Message too short.'),
  validate,
  ctrl.create
);

// Admin
router.get('/',        adminOnly, ctrl.getAll);
router.get('/:id',     adminOnly, ctrl.getOne);
router.put('/:id',     adminOnly, ctrl.update);
router.delete('/:id',  adminOnly, ctrl.remove);

module.exports = router;
