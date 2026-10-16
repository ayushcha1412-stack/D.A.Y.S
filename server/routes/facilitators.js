const router    = require('express').Router();
const ctrl      = require('../controllers/facilitatorController');
const { adminOnly } = require('../middleware/auth');
const { uploadSingle } = require('../middleware/upload');

router.get('/',          ctrl.getAll);
router.get('/:id',       ctrl.getOne);
router.post('/',         adminOnly, ctrl.create);
router.put('/:id',       adminOnly, ctrl.update);
router.delete('/:id',    adminOnly, ctrl.remove);
router.post('/:id/image',adminOnly, uploadSingle, ctrl.uploadImage);

module.exports = router;
