const async = require('async');

var Card = require('../models/card');
var CardInstance = require('../models/cardinstance');
var Expansion = require('../models/expansion');
var Series = require('../models/series');

// Display list of all Series.
exports.series_list = function(req, res) {
  res.send('NOT IMPLEMENTED: Series list');
};

// Display detail page for a specific Series.
exports.series_detail = function(req, res) {
  res.send('NOT IMPLEMENTED: Series detail: ' + req.params.id);
};

// Display Series create form on GET.
exports.series_create_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Series create GET');
};

// Handle Series create on POST.
exports.series_create_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Series create POST');
};

// Display Series delete form on GET.
exports.series_delete_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Series delete GET');
};

// Handle Series delete on POST.
exports.series_delete_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Series delete POST');
};

// Display Series update form on GET.
exports.series_update_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Series update GET');
};

// Handle Series update on POST.
exports.series_update_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Series update POST');
};