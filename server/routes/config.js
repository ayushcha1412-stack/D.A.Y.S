const router = require('express').Router();
const ctrl   = require('../controllers/siteConfigController');
const { adminOnly } = require('../middleware/auth');

router.get('/',                ctrl.getConfig);
router.put('/',                adminOnly, ctrl.updateConfig);
router.get('/stats',           adminOnly, ctrl.getDashboardStats);
router.get('/socials',         ctrl.getSocials);
router.post('/socials',        adminOnly, ctrl.createSocial);
router.put('/socials/:id',     adminOnly, ctrl.updateSocial);
router.delete('/socials/:id',  adminOnly, ctrl.removeSocial);

module.exports = router;
