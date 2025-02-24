const express = require('express');
const router = express.Router();
const lentesControllers = require('../controllers/lentesControllers');
const {
    validateId,
    productExists,
    validateProductData
} = require('../middlewares/middlewareLentes');

// Rutas con middlewares aplicados
router.get('/', lentesControllers.getLentes);
router.get('/:id', validateId, lentesControllers.getLenteById);
router.post('/', validateProductData, lentesControllers.addLente);
router.put('/:id', validateId, productExists, validateProductData, lentesControllers.updateLente);
router.delete('/:id', validateId, productExists, lentesControllers.deleteLente);

module.exports = router;
