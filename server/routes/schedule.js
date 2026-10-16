const router = require('express').Router();
const ctrl   = require('../controllers/scheduleController');
const { adminOnly } = require('../middleware/auth');

router.get('/',        ctrl.getAll);
router.post('/',       adminOnly, ctrl.create);
router.put('/:id',     adminOnly, ctrl.update);
router.delete('/:id',  adminOnly, ctrl.remove);

module.exports = router;
