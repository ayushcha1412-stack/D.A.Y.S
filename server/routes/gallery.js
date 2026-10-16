const router = require('express').Router();
const ctrl   = require('../controllers/galleryController');
const { adminOnly } = require('../middleware/auth');
const { uploadSingle } = require('../middleware/upload');

router.get('/',        ctrl.getAll);
router.get('/:id',     ctrl.getOne);
router.post('/',       adminOnly, uploadSingle, ctrl.create);
router.put('/:id',     adminOnly, uploadSingle, ctrl.update);
router.delete('/:id',  adminOnly, ctrl.remove);

module.exports = router;
