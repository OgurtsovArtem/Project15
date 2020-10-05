
const router = require("express").Router();
const { celebrate, Joi } = require('celebrate');

const { createUser, getUserId, getUser, updateUser, updateUserAvatar } = require('../controllers/users');

router.get("/users", celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required().regex(/([a-zA-z]+)?\d+([a-zA-z]+)?/)
  }).unknown(true),
}), getUser);

router.get("/users/:userId", celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }).unknown(true),
  headers: Joi.object().keys({
    authorization: Joi.string().required().regex(/([a-zA-z]+)?\d+([a-zA-z]+)?/)
  }).unknown(true),
}), getUserId);

router.post("/users", celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
    password: Joi.string().required().min(8),
    email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: true } }),
    avatar: Joi.string().required().regex(/[-a-zA-Z0-9@:%_+.~#?&/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_+.~#?&/=]*)?/),
  }),
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }).unknown(true),
  headers: Joi.object().keys({
    authorization: Joi.string().required().regex(/([a-zA-z]+)?\d+([a-zA-z]+)?/)
  }).unknown(true),
}), createUser);

router.patch("/users/me",  celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required().regex(/([a-zA-z]+)?\d+([a-zA-z]+)?/)
  }).unknown(true),
}),updateUser);
router.patch("/users/me/avatar",  celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required().regex(/([a-zA-z]+)?\d+([a-zA-z]+)?/)
  }).unknown(true),
}),updateUserAvatar);



module.exports = router;
