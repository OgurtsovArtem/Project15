/* eslint-disable no-undef */
const router = require("express").Router();
const { celebrate, Joi } = require('celebrate');
Joi.objectId = require('joi-objectid')(Joi);

const { getCard, deleteCardId, createCard, likeCard, dislikeCard } = require('../controllers/cards')

router.get("/cards", celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required().regex(/([a-zA-z]+)?\d+([a-zA-z]+)?/)
  }).unknown(true),
}), getCard);

router.post("/cards", celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().required().regex(/[-a-zA-Z0-9@:%_+.~#?&/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_+.~#?&/=]*)?/),
    owner: Joi.objectId().required(),
    likes: Joi.objectId().required(),
    createdAt: Joi.date()
  }),
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }).unknown(true),
  headers: Joi.object().keys({
    authorization: Joi.string().required().regex(/([a-zA-z]+)?\d+([a-zA-z]+)?/)
  }).unknown(true),
}),createCard);

router.delete("/cards/:cardId", celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }).unknown(true),
  headers: Joi.object().keys({
    authorization: Joi.string().required().regex(/([a-zA-z]+)?\d+([a-zA-z]+)?/)
  }).unknown(true),
}),deleteCardId);

router.put("/cards/:cardId/likes", celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }).unknown(true),
  headers: Joi.object().keys({
    authorization: Joi.string().required().regex(/([a-zA-z]+)?\d+([a-zA-z]+)?/)
  }).unknown(true),
}), likeCard);

router.delete("/cards/:cardId/likes", celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }).unknown(true),
  headers: Joi.object().keys({
    authorization: Joi.string().required().regex(/([a-zA-z]+)?\d+([a-zA-z]+)?/)
  }).unknown(true),
}), dislikeCard);

module.exports = router;