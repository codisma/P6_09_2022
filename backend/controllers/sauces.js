
const Sauce = require('../models/sauce');
//const fs = require('fs');

exports.getAllSauces = (req, res, next) => {
    Sauce.find().then(
        (sauce) => {
            res.status(200).json(sauce);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};

exports.getOneSauces = (req, res, next) => {
    Sauce.findOne({
        _id: req.params.id
    }).then(
        (sauce) => {
            res.status(200).json(sauce);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
};



exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId;
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [''],
        usersDisliked: [''],
    });

    sauce.save()
        .then(() => { res.status(201).json({ message: 'Sauces enregistré !' }) })
        .catch(error => { res.status(400).json({ error }) })
};



exports.modifySauce = (req, res, next) => {
    const sauce = new Sauce({
        _id: req.params.id,
        name: req.body.name,
        manufacturer: req.body.manufacturer,
        description: req.body.description,
        mainPepper: req.body.mainPepper,
        imageUrl: req.body.imageUrl,
        heat: req.body.heat,
        userId: req.body.userId
    });
    Sauce.updateOne({ _id: req.params.id }, sauce)
        .then(
            () => {
                res.status(201).json({
                    message: 'Thing updated successfully!'
                });
            }
        ).catch(
            (error) => {
                res.status(400).json({
                    error: error
                });
            }
        );
};

exports.deleteSauce = (req, res, next) => {
    Sauce.deleteOne({ _id: req.params.id }).then(
        () => {
            res.status(200).json({
                message: 'Deleted!'
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};

exports.likeDislikeSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (req.body.like == 1 && !sauce.usersLiked.includes(req.auth.userId)) {

                // Si l'utilisateur authentifié n'est pas contenu dans tableau 'usersLiked'
                // Et si like = 1 => Incrémente likes et ajoute l'utilisateur dans tableau 'usersLiked'
                Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: 1 }, $push: { usersLiked: req.auth.userId } })
                    .then(() => res.status(200).json({ message: "Incremente likes et ajoute un utilisateur qui aime !" }))
                    .catch(error => res.status(400).json({ error }))
            } else if (req.body.like == -1 && !sauce.usersDisliked.includes(req.auth.userId)) {

                // Si l'utilisateur authentifié n'est pas contenu dans tableau 'usersDisliked'
                // Et si Like = -1 => Incrémente dislikes et ajoute l'utilisateur dans tableau 'usersDisliked'
                Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: 1 }, $push: { usersDisliked: req.auth.userId } })
                    .then(() => { res.status(200).json({ message: "Ajoute un utilisateur qui n' aime pas !" }) })
                    .catch(error => res.status(400).json({ error }))
            } else {
                if (sauce.usersLiked.includes(req.auth.userId)) {

                    // Si like = 0, et que l'utilisateur est dans le tableau 'usersLiked'
                    Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: -1 }, $pull: { usersLiked: req.auth.userId } })
                        .then(() => { res.status(200).json({ message: "Décrément likes et enléve un utilisateur qui aime !" }) })
                        .catch(error => res.status(400).json({ error }))
                } else {

                    // Sinon, si like = 0, cela signifie que l'utilisateur est dans le tableau 'usersDisliked'
                    Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: -1 }, $pull: { usersDisliked: req.auth.userId } })
                        .then(() => { res.status(200).json({ message: "Décrémente Dislikes et enléve un utilisateur qui n'aime pas !" }) })
                        .catch(error => res.status(400).json({ error }))
                }
            };
        })
        .catch(error => res.status(400).json({ error }))
}
/*exports.likeDislikeSauce = (req, res, next) => {
    let like = req.body.like
    let userId = req.body.userId
    let sauceId = req.params.id
    
    switch (like) {
            case 1 :
                Sauce.updateOne({ _id: sauceId }, { $push: { usersLiked: userId }, $inc: { likes: +1 }})
            .then(() => res.status(200).json({ message: `J'aime` }))
            .catch((error) => res.status(400).json({ error }))

        break;
        
        case 0 :
            Sauce.findOne({ _id: sauceId })
                .then((sauce) => {
                if (sauce.usersLiked.includes(userId)) { 
                Sauce.updateOne({ _id: sauceId }, { $pull: { usersLiked: userId }, $inc: { likes: -1 }})
                    .then(() => res.status(200).json({ message: `Neutre` }))
                    .catch((error) => res.status(400).json({ error }))
                }
                if (sauce.usersDisliked.includes(userId)) { 
                Sauce.updateOne({ _id: sauceId }, { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 }})
                .then(() => res.status(200).json({ message: `Neutre` }))
                    .catch((error) => res.status(400).json({ error }))
                }
            })
            .catch((error) => res.status(404).json({ error }))
        break;

    case -1 :
            Sauce.updateOne({ _id: sauceId }, { $push: { usersDisliked: userId }, $inc: { dislikes: +1 }})
            .then(() => { res.status(200).json({ message: `Je n'aime pas` }) })
            .catch((error) => res.status(400).json({ error }))
        break;
        
        default:
            console.log(error);
    }
}*/

