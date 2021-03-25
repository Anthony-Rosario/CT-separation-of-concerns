const { Router } = require('express');
const OrderService = require('../services/OrderService');

module.exports = Router()
  .post('/', async (req, res, next) => {
    OrderService
      .create(req.body)
      .then(order => res.send(order))
      .catch(next);
  })


  .get('/', async (req, res, next) => {
    OrderService
      .getAll()
      .then(order => res.send(order))
      .catch(next)
  })


  .get('/:id', async (req, res, next) => {
    OrderService
      .getById(req.params.id)
      .then(order => res.send(order))
      .catch(next)
  })


  .put('/:id', async (req, res, next) => {
    OrderService
      .updateById(req.params.id, req.body)
      .then(order => res.send(order))
      .catch(next)
  })


  .delete('/:id', async (req, res, next) => {
    OrderService
      .deleteById(req.params.id)
      .then(order => res.send(order))
      .catch(next)
  });