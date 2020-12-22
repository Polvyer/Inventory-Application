#! /usr/bin/env node

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Series = require('./models/series')
var Expansion = require('./models/expansion')
var Card = require('./models/card')
var CardInstance = require('./models/cardinstance')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var seriess = []
var expansions = []
var cards = []
var cardinstances = []

function seriesCreate(series_name, series_release_date, cb) {
  seriesdetail = { 
    series_name: series_name, 
    series_release_date: series_release_date 
  };
  
  var series = new Series(seriesdetail);
       
  series.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Series: ' + series);
    seriess.push(series)
    cb(null, series)
  }  );
}

function expansionCreate(expansion_name, expansion_release_date, series, cards_in_set, cb) {
  expansiondetail = { 
    expansion_name: expansion_name, 
    expansion_release_date: expansion_release_date, 
    series: series, 
    cards_in_set: cards_in_set 
  };

  var expansion = new Expansion(expansiondetail);
       
  expansion.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Expansion: ' + expansion);
    expansions.push(expansion)
    cb(null, expansion);
  }   );
}

function cardCreate(card_name, set_number, rarity, expansion, cb) {
  carddetail = { 
    card_name: card_name,
    set_number: set_number,
    expansion: expansion
  }

  if (rarity != false) carddetail.rarity = rarity
    
  var card = new Card(carddetail);    
  card.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Card: ' + card);
    cards.push(card)
    cb(null, card)
  }  );
}

function cardInstanceCreate(card, condition, sale_price, grader, grade, cb) {
  cardinstancedetail = { 
    card: card,
    sale_price: sale_price
  }    
  if (condition != false) cardinstancedetail.condition = condition
  if (grader != false) {
    cardinstancedetail.grader = grader
    if (grade != false) cardinstancedetail.grade = grade
  }
    
  var cardinstance = new CardInstance(cardinstancedetail);    
  cardinstance.save(function (err) {
    if (err) {
      console.log('ERROR CREATING CardInstance: ' + cardinstance);
      cb(err, null)
      return
    }
    console.log('New CardInstance: ' + cardinstance);
    cardinstances.push(cardinstance)
    cb(null, card)
  }  );
}

function createSeries(cb) {
  async.series([
    function(callback) {
      seriesCreate('Sword & Shield', '2020-02-07', callback);
    },
    function(callback) {
      seriesCreate('Sun & Moon', '2017-02-03', callback);
    },
    function(callback) {
      seriesCreate('XY', '2014-02-05', callback);
    },
    function(callback) {
      seriesCreate('Black & White', '2011-04-25', callback);
    },
    function(callback) {
      seriesCreate('HeartGold & SoulSilver', '2010-02-10', callback);
    },
    function(callback) {
      seriesCreate('Platinum', '2009-02-11', callback);
    },
    function(callback) {
      seriesCreate('Diamond & Pearl', '2007-05-01', callback);
    },
    function(callback) {
      seriesCreate('EX', '2003-07-01', callback);
    },
    ],
    // optional callback
    cb);
}

function createExpansions(cb) {
    async.series([
        function(callback) {
          expansionCreate('Shining Fates', '2021-02-19', seriess[0], 190, callback);
        },
        function(callback) {
          expansionCreate('Vivid Voltage', '2020-11-13', seriess[0], 185, callback);
        },
        function(callback) {
          expansionCreate("Champion's Path", '2020-09-25', seriess[0], 70, callback);
        },
        function(callback) {
          expansionCreate("Darkness Ablaze", '2020-08-14', seriess[0], 185, callback);
        },
        function(callback) {
          expansionCreate("Rebel Clash", '2020-05-01', seriess[0], 190, callback);
        },
        function(callback) {
          expansionCreate("Sword & Shield", '2020-02-07', seriess[0], 200, callback);
        },
        function(callback) {
          expansionCreate("Cosmic Eclipse", '2019-11-01', seriess[1], 230, callback);
        },
        function(callback) {
          expansionCreate("Hidden Fates", '2019-08-23', seriess[1], 150, callback);
        },
        function(callback) {
          expansionCreate("Unified Minds", '2019-08-02', seriess[1], 230, callback);
        },
        function(callback) {
          expansionCreate("Unbroken Bonds", '2019-05-03', seriess[1], 210, callback);
        },
        function(callback) {
          expansionCreate("Detective Pikachu", '2019-03-29', seriess[1], 27, callback);
        },
        function(callback) {
          expansionCreate("Team Up", '2019-02-01', seriess[1], 180, callback);
        },
        function(callback) {
          expansionCreate("Dragon Majesty", '2018-09-07', seriess[1], 70, callback);
        },
        function(callback) {
          expansionCreate("Ultra Prism", '2018-02-02', seriess[1], 150, callback);
        },
        function(callback) {
          expansionCreate("Shining Legends", '2017-10-06', seriess[1], 70, callback);
        },
        function(callback) {
          expansionCreate("Burning Shadows", '2017-08-04', seriess[1], 140, callback);
        },
        function(callback) {
          expansionCreate("Generations", '2016-02-22', seriess[2], 110, callback);
        },
        function(callback) {
          expansionCreate("Ancient Origins", '2015-08-12', seriess[2], 90, callback);
        },
        function(callback) {
          expansionCreate("Flashfire", '2014-05-07', seriess[2], 100, callback);
        },
        function(callback) {
          expansionCreate("Dragons Exalted", '2012-08-15', seriess[3], 120, callback);
        },
        function(callback) {
          expansionCreate("Undaunted", '2010-08-18', seriess[4], 90, callback);
        },
        function(callback) {
          expansionCreate("Arceus", '2009-11-04', seriess[5], 99, callback);
        },
        function(callback) {
          expansionCreate("Legends Awakened", '2008-08-01', seriess[6], 146, callback);
        },
        function(callback) {
          expansionCreate("Unseen Forces", '2005-08-01', seriess[7], 115, callback);
        },
        ],
        // optional callback
        cb);
}

function createCards(cb) {
    async.parallel([
        function(callback) {
          cardCreate('Pikachu VMAX', 188, 'Other', expansions[1], callback);
        },
        function(callback) {
          cardCreate('Pikachu V', 170, 'Ultra Rare', expansions[1], callback);
        },
        function(callback) {
          cardCreate('Jirachi', 119, 'Other', expansions[1], callback);
        },
        function(callback) {
          cardCreate('Togekiss VMAX', 191, 'Other', expansions[1], callback);
        },
        function(callback) {
          cardCreate('Charizard VMAX', 74, 'Other', expansions[2], callback);
        },
        function(callback) {
          cardCreate('Charizard V', 79, 'Ultra Rare', expansions[2], callback);
        },
        function(callback) {
          cardCreate('Charizard VMAX', 20, 'Ultra Rare', expansions[3], callback);
        },
        function(callback) {
          cardCreate('Rillaboom', 197, 'Secret Rare', expansions[3], callback);
        },
        ],
        // optional callback
        cb);
}

function createCardInstances(cb) {
    async.parallel([
        function(callback) {
          cardInstanceCreate(cards[0], false, 309.99, false, false, callback)
        },
        function(callback) {
          cardInstanceCreate(cards[1], false, 49.99, false, false, callback)
        },
        function(callback) {
          cardInstanceCreate(cards[2], false, 26.99, false, false, callback)
        },
        function(callback) {
          cardInstanceCreate(cards[2], false, 29.98, 'PSA', 7.5, callback)
        },
        function(callback) {
          cardInstanceCreate(cards[3], false, 20.99, false, false, callback)
        },
        function(callback) {
          cardInstanceCreate(cards[4], false, 449.99, false, false, callback)
        },
        function(callback) {
          cardInstanceCreate(cards[4], false, 463.98, 'PSA', 8.0, callback)
        },
        function(callback) {
          cardInstanceCreate(cards[4], false, 469.99, 'BGS', 7.5, callback)
        },
        function(callback) {
          cardInstanceCreate(cards[5], false, 449.99, false, false, callback)
        },
        function(callback) {
          cardInstanceCreate(cards[5], false, 489.99, 'PSA', 8.5, callback)
        },
        function(callback) {
          cardInstanceCreate(cards[6], false, 149.99, 'BGS', 9.5, callback)
        },
        function(callback) {
          cardInstanceCreate(cards[6], false, 134.99, 'BGS', 8.0, callback)
        },
        function(callback) {
          cardInstanceCreate(cards[6], false, 134.98, 'BGS', 7.5, callback)
        },
        function(callback) {
          cardInstanceCreate(cards[6], false, 129.95, 'PSA', 8.5, callback)
        },
        function(callback) {
          cardInstanceCreate(cards[6], false, 129.89, 'PSA', 7.5, callback)
        },
        function(callback) {
          cardInstanceCreate(cards[6], false, 129.88, false, false, callback)
        },
        ],
        // Optional callback
        cb);
}

async.series([
    createSeries,
    createExpansions,
    createCards,
    createCardInstances
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    } else {
        console.log('CARDInstances: '+cardinstances);
    }
    // All done, disconnect from database
    mongoose.connection.close();
});