const router = require('express').Router();
const ctrl   = require('../controllers/achievementController');
const { adminOnly } = require('../middleware/auth');

router.get('/',               ctrl.getAll);
router.get('/stats',          ctrl.getStats);
router.get('/:id',            ctrl.getOne);
router.post('/',              adminOnly, ctrl.create);
router.put('/:id',            adminOnly, ctrl.update);
router.delete('/:id',         adminOnly, ctrl.remove);

// Stats sub-resource
router.post('/stats',         adminOnly, ctrl.createStat);
router.put('/stats/:id',      adminOnly, ctrl.updateStat);
router.delete('/stats/:id',   adminOnly, ctrl.removeStat);

module.exports = router;
