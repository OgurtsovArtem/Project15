const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const NotFoundError = require('../erros/404-not-found-err');
const UnauthorizedError = require('../erros/401-unauthorized-err');
// eslint-disable-next-line no-undef
const { JWT_SECRET = 'dev-key' } = process.env

module.exports.getUser = (req,res,next) => {
  User.find({})
  .then((user) => {
    // eslint-disable-next-line no-constant-condition
    if (+[user] === 0 ) {
      throw new NotFoundError('Пользователи отсутствуют в базе');
    }
    res.send({data: user});
  })
  .catch(next);
}

module.exports.getUserId = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      res.send(user);
    })
    .catch(next);
}

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;
  User.init().then(() => {
    bcrypt.hash(password, 10)
    .then(hash => User.create({ name, about, avatar, email, password: hash }))
    .then((user) =>  User.findById(user._id))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        throw new UnauthorizedError('Переданы некорректные данные');
    } else if (err.code === 11000) {
      const err = new Error('Данный Email уже зарегистрирован');
      err.statusCode = 409;
      next(err);
    }
    })
    .catch(next)
   });
};

module.exports.updateUser = (req, res, next) => {
  const { name } = req.body;
  User.findByIdAndUpdate(req.user._id, { name: name })
  .then((user) => {
    if (!user) {
      throw new UnauthorizedError('Ошибка авторизации');
    }
    res.send(user);
  })
  .catch(next);
}

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar: avatar })
  .then((user) => {
    if (!user) {
      throw new UnauthorizedError('Ошибка авторизации');
    }
    res.send(user);
  })
  .catch(next);
}

module.exports.login = (req,res,next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET , {expiresIn:'7d'})
        res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true
    })
      res.send({ token });
    })
    .catch((err) => {
      throw new UnauthorizedError(err.message);
    })
    .catch(next)
}

