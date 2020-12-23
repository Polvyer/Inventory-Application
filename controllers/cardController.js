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
    res.render('index', { title: 'Pokemon Card Series & Sets Home', error: err, data: results });
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
      if (err || card === null) { 
        var err = new Error('Card not found');
        err.status = 404;
        return next(err) 
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
      Expansion.find()
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
        Expansion.find()
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
exports.card_delete_get = function(req, res, next) {
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
      // Card has no copies. Delete card image in images folder.
      filename = results.card.card_name.split(' ').join('').toLowerCase() + results.card.set_number.toString() + '.jpg';
      fs.unlink(`./public/images/${filename}`, (err) => {
        if (err) { return next(err); }
        // Successful - now delete object and redirect to the list of cards.
        Card.findByIdAndRemove(req.body.cardid, function deleteCard(err) {
          if (err) { return next(err); }
          res.redirect('/catalog/card')
        })
      });
    }
  })
};

// Display card update form on GET.
exports.card_update_get = function(req, res, next) {
  async.parallel({
    card: function(callback) {
      Card.findById(req.params.id)
      .exec(callback)
    },
    expansions: function(callback) {
      Expansion.find(callback)
    }
  }, function(err, results) {
    if (err) { return next(err); }
    if (results.card === null) { // No results
      var err = new Error('Card not found');
      err.status = 404;
      return next(err);
    }
    // Success - so render.
    res.render('card_form', { title: 'Update Card', rarities: results.card.list_of_rarities, card: results.card, expansions: results.expansions });
  })
};

// Handle card update on POST.
exports.card_update_post = function(req, res, next) {
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
        _id: req.params.id, // This is required, or a new ID will be assigned!
        card_name: req.body.card_name,
        set_number: req.body.set_number,
        rarity: req.body.rarity,
        expansion: req.body.expansion,
      }
    );
  
    async.parallel({
      // Card we're updating
      card: function(callback) {
        Card.findById(req.params.id)
          .exec(callback)
      },
      // To check for duplicates
      cards: function(callback) {
        Card.find(callback)
      },
      // For form selection options (in case update fails)
      expansions: function(callback) {
        Expansion.find()
          .exec(callback)
      }
    }, function(err, results) {
      if (err) { return next(err); }
  
      // Ensure card is not a duplicate (exclude card being updated)
      const newKey = newCard.card_name.split(' ').join('').toLowerCase() + newCard.set_number.toString();
      const oldKey = results.card.card_name.split(' ').join('').toLowerCase() + results.card.set_number.toString();
      const dupe = results.cards.some(card => {
        let existingKey = card.card_name.split(' ').join('').toLowerCase() + card.set_number.toString();
        if (oldKey === existingKey) {
          return false;
        }
        return newKey === existingKey;
      });

      // Check if card is a duplicate
      if (dupe) {
        // Card is a duplicate - delete card in tmp folder.
        let filename = req.body.card_name.split(' ').join('').toLowerCase() + req.body.set_number.toString() + '.jpg';
        fs.unlink(`./public/tmp/${filename}`, (err) => {
          if (err) { return next(err); }
          // Successfully deleted - now render form again w/ errors
          res.render('card_form', { title: 'Update Card', card: newCard, rarities: newCard.list_of_rarities, expansions: results.expansions, errors: ['Card is a duplicate', ] });
        });
      } 
      else {
        // Card is not a duplicate - update card.
        Card.findByIdAndUpdate(req.params.id, newCard, {}, function(err, oldCard) {
          console.log('Old card:', oldCard);
          console.log('New card:', newCard);
          if (err) { return next(err); }
          // Successfully updated - now remove old image
          let oldFilename = oldCard.card_name.split(' ').join('').toLowerCase() + oldCard.set_number.toString() + '.jpg';
          console.log('Old Filename:', oldFilename)
          fs.unlink(`./public/images/${oldFilename}`, (err) => {
            if (err) { return next(err); }
            // Successfully deleted - now move new card image to the correct folder (tmp -> images)
            let newFilename = newCard.card_name.split(' ').join('').toLowerCase() + newCard.set_number.toString() + '.jpg';
            console.log('New Filename:', newFilename)
            fs.rename(`./public/tmp/${newFilename}`, `./public/images/${newFilename}`, function(err) {
            if (err) { return next(err); }
            res.redirect(oldCard.url);
          });
          });
        });
      }
      return;
    });
  })
};