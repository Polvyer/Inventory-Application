const async = require('async');

var Card = require('../models/card');
var CardInstance = require('../models/cardinstance');
var Expansion = require('../models/expansion');
var Series = require('../models/series');

// Display list of all Expansions.
exports.expansion_list = function(req, res) {
  res.send('NOT IMPLEMENTED: Expansion list');
};

// Display detail page for a specific Expansion.
exports.expansion_detail = function(req, res) {
  res.send('NOT IMPLEMENTED: Expansion detail: ' + req.params.id);
};

// Display Expansion create form on GET.
exports.expansion_create_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Expansion create GET');
};

// Handle Expansion create on POST.
exports.expansion_create_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Expansion create POST');
};

// Display Expansion delete form on GET.
exports.expansion_delete_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Expansion delete GET');
};

// Handle Expansion delete on POST.
exports.expansion_delete_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Expansion delete POST');
};

// Display Expansion update form on GET.
exports.expansion_update_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Expansion update GET');
};

// Handle Expansion update on POST.
exports.expansion_update_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Expansion update POST');
};