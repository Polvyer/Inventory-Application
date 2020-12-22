const async = require('async');
const { body, validationResult } = require('express-validator');
var multer  = require('multer')
var fs = require('fs');

var Card = require('../models/card');
var CardInstance = require('../models/cardinstance');
var Expansion = require('../models/expansion');
var Series = require('../models/series');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/tmp/')
  },
  filename: function (req, file, cb) {
    cb(null, req.body.card_name.split(' ').join('').toLowerCase() + req.body.set_number.toString() + '.jpg');
  },
});

var upload = multer({ storage: storage }).single('card_img');

exports.index = function(req, res, next) {
  async.parallel({
    card_count: function(callback) {
      Card.countDocuments({}, callback);
    },
    card_instance_count: function(callback) {
      CardInstance.countDocuments({}, callback);
    },
    expansion_count: function(callback) {
      Expansion.countDocuments({}, callback);
    },
    series_count: function(callback) {
      Series.countDocuments({}, callback);
    }
  }, function(err, results) {
    res.render('index', { title: 'Local Inventory Home', error: err, data: results });
  })
};

// Display list of all cards.
exports.card_list = function(req, res, next) { 
  Card.find()
    .populate('expansion')
    .exec(function(err, list_cards) {
      if (err) { return next(err) }
      res.render('card_list', { title: 'Card List', card_list: list_cards });
    })
};

// Display detail page for a specific card.
exports.card_detail = function(req, res, next) {
  Card.findById(req.params.id)
    .populate('expansion')
    .exec(function(err, card) {
      if (err) { return next(err) }
      if (card === null) {
        var err = new Error('Card not found');
        err.status = 404;
        return next(err);
      }
      Series.findById(card.expansion.series, 'series_name')
        .exec(function(err, series) {
          if (err) { return next(err) }
          res.render('card_detail', { title: card.card_name, card: card, series_name: series.series_name });
        })
    })
};

// Display card create form on GET.
exports.card_create_get = function(req, res, next) {
  async.parallel({
    expansions: function(callback) {
      Expansion.find({}, 'expansion_name')
        .exec(callback)
    },
    cards: function(callback) {
      Card.find(callback)
    },
  }, function(err, results) {
    if (err) { return next(err); }
    res.render('card_form', { title: 'Create Card', rarities: results.cards[0].list_of_rarities, expansions: results.expansions  });
  });
};

// Handle card create on POST.
exports.card_create_post = function(req, res, next) {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      return next(err);
    } else if (err) {
      // An unknown error occurred when uploading.
      return next(err);
    }
    // Successful - card has been uploaded to tmp folder.
    var newCard = new Card(
      {
        card_name: req.body.card_name,
        set_number: req.body.set_number,
        rarity: req.body.rarity,
        expansion: req.body.expansion,
      }
    );
  
    async.parallel({
      cards: function(callback) {
        Card.find(callback)
      },
      expansions: function(callback) {
        Expansion.find({}, 'expansion_name')
          .exec(callback)
      }
    }, function(err, results) {
      if (err) { return next(err); }
  
      // Ensure card is not a duplicate
      const newKey = newCard.card_name.split(' ').join('').toLowerCase() + newCard.set_number.toString();
      const dupe = results.cards.some(card => {
        let existingKey = card.card_name.split(' ').join('').toLowerCase() + card.set_number.toString();
        return newKey === existingKey;
      });

      // Card is a duplicate
      if (dupe) {
        // Delete card in tmp folder.
        filename = req.body.card_name.split(' ').join('').toLowerCase() + req.body.set_number.toString() + '.jpg';
        fs.unlink(`./public/tmp/${filename}`, (err) => {
          if (err) { return next(err); }
          // Successful - now render w/ errors
          res.render('card_form', { title: 'Create Card', card: newCard, rarities: newCard.list_of_rarities, expansions: results.expansions, errors: ['Card is a duplicate', ] });
        });
      } else {
        // Card is not a duplicate. Save card.
        newCard.save(function(err) {
          if (err) { return next(err); }
          // Successful - move card to images folder and redirect to new card record.
          filename = req.body.card_name.split(' ').join('').toLowerCase() + req.body.set_number.toString() + '.jpg';
          fs.rename(`./public/tmp/${filename}`, `./public/images/${filename}`, function(err) {
            if (err) { return next(err); }
            res.redirect(newCard.url);
          });
        });
      }
      return;
    });
  })
};

// Display card delete form on GET.
exports.card_delete_get = function(req, res) {
  async.parallel({
    card_instances: function(callback) {
      CardInstance.find({ card: req.params.id })
        .exec(callback);
    },
    card: function(callback) {
      Card.findById(req.params.id)
        .populate('expansion')
        .exec(callback);
    }
  }, function(err, results) {
    if (err) { return next(err); }
    if (results.card === null) { // No results
      res.redirect('/catalog/card');
    }
    // Successful - render.
    res.render('card_delete', { title: 'Delete Card', card: results.card, card_instances: results.card_instances });
  })
};

// Handle card delete on POST.
exports.card_delete_post = function(req, res) {
  async.parallel({
    card_instances: function(callback) {
      CardInstance.find({ card: req.body.cardid })
        .exec(callback);
    },
    card: function(callback) {
      Card.findById(req.body.cardid)
        .populate('expansion')
        .exec(callback);
    }
  }, function(err, results) {
    if (err) { return next(err); }
    if (results.card_instances.length > 0) {
      // Card has copies. Render in the same way as for GET route.
      res.render('card_delete', { title: 'Delete Card', card: results.card, card_instances: results.card_instances });
      return;
    } else {
      // Card has no copies. Delete object and redirect to the list of cards.
      Card.findByIdAndRemove(req.body.cardid, function deleteCard(err) {
        if (err) { return next(err); }
        // Success - go to card list
        res.redirect('/catalog/card')
      })
    }
  })
};

// Display card update form on GET.
exports.card_update_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Card update GET');
};

// Handle card update on POST.
exports.card_update_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Card update POST');
};