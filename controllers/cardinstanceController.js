const async = require('async');

var Card = require('../models/card');
var CardInstance = require('../models/cardinstance');
var Expansion = require('../models/expansion');
var Series = require('../models/series');

// Display list of all CardInstances.
exports.cardinstance_list = function(req, res) {
  res.send('NOT IMPLEMENTED: CardInstance list');
};

// Display detail page for a specific CardInstance.
exports.cardinstance_detail = function(req, res) {
  res.send('NOT IMPLEMENTED: CardInstance detail: ' + req.params.id);
};

// Display CardInstance create form on GET.
exports.cardinstance_create_get = function(req, res) {
  res.send('NOT IMPLEMENTED: CardInstance create GET');
};

// Handle CardInstance create on POST.
exports.cardinstance_create_post = function(req, res) {
  res.send('NOT IMPLEMENTED: CardInstance create POST');
};

// Display CardInstance delete form on GET.
exports.cardinstance_delete_get = function(req, res) {
  res.send('NOT IMPLEMENTED: CardInstance delete GET');
};

// Handle CardInstance delete on POST.
exports.cardinstance_delete_post = function(req, res) {
  res.send('NOT IMPLEMENTED: CardInstance delete POST');
};

// Display CardInstance update form on GET.
exports.cardinstance_update_get = function(req, res) {
  res.send('NOT IMPLEMENTED: CardInstance update GET');
};

// Handle Cardinstance update on POST.
exports.cardinstance_update_post = function(req, res) {
  res.send('NOT IMPLEMENTED: CardInstance update POST');
};