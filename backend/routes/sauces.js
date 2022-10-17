const express = require('express');
const router = express.Router();

const auth = require('../middelware/auth');
const multer = require('../middelware/multer-cinfig')

const stuffCtrl = require('../controllers/sauces');

router.get('/', auth, stuffCtrl.getAllSauces);
router.post('/', auth, multer, stuffCtrl.createSauce);
router.get('/:id', auth, stuffCtrl.getOneSauces);
router.put('/:id', auth, multer, stuffCtrl.modifySauce);
router.delete('/:id', auth, stuffCtrl.deleteSauce);
router.post("/:id/like", auth, stuffCtrl.likeDislikeSauce)

module.exports = router;