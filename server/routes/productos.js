var express = require('express');
var router = express.Router();
let controller = require('../controllers/productoController');

// listar productos
router.get('/', function(req, res, next) {
  controller.listar(req, res);
});

// mostrar un producto por su id
router.get('/:id', function(req, res, next) {
  controller.show(req, res);
});

// crear producto
router.post('/', function(req, res){
  controller.store(req, res);
});

// actualizar producto
router.put('/', function(req, res){
  controller.edit(req, res);
});

// eliminar producto
router.delete('/:id', function(req, res){
  controller.delete(req, res);
});

module.exports = router;
