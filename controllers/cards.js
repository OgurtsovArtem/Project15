const Card = require('../models/card');
const NotFoundError = require('../erros/404-not-found-err');
const BadRequestError = require('../erros/400-bad-request-err');

module.exports.getCard = (req,res,next) => {
  Card.find({})
  .then((card) => {
    // eslint-disable-next-line no-constant-condition
    if (+[card] === 0 ) {
      throw new NotFoundError('Карточки отсутствуют в базе');
    }
    res.send({data: card});
  })
  .catch(next);
}
module.exports.deleteCardId = (req,res,next) => {
    Card.findById(req.params.cardId)
    .then((card) => {
      if(req.user._id != card.owner){
        console.log(req.user._id,card.owner)
        return Promise.reject(new Error('notEnoughRights'));
      }else {
        Card.deleteOne({_id: req.params.cardId})
        .then((card)=>{
          res.send({ data: card })
        })
        .catch(next)
      }
    })
    .catch((err) => {
      if(err.message === 'notEnoughRights'){
        const err = new Error('У вас недостаточно прав');
        err.statusCode = 403;
        next(err);
      }
      else {
        throw new NotFoundError('Карточка не найдена')
      }
    })
    .catch(next)
}
module.exports.createCard = (req, res, next) => {
  const { name, link, ownerId = req.user._id } = req.body;
  Card.create({ name, link, owner: ownerId })
    .then(card => {
      res.send({ data: card })
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        throw new BadRequestError("Переданы некорректные данные")
    }
    })
    .catch(next)
};
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
.then((card) => {
  if (!card) {
    throw new NotFoundError('Карточка не найдена');
  }
  res.send({data: card});
})
.catch(next);
}


module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
.then((card) => {
  if (!card) {
    throw new NotFoundError('Карточка не найдена');
  }
  res.send({data: card});
})
.catch(next);
}