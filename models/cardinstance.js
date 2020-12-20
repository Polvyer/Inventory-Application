var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CardInstanceSchema = new Schema(
  {
    series_name: { type: String, required: true, maxlength: 45 },
    series_release_date: { type: Date, required: true }
  }
);

// Virtual for cardinstance's URL
CardInstanceSchema
  .virtual('url')
  .get(function() {
    return `/catalog/cardinstance/${this._id}`;
  });

// Export model
module.exports = mongoose.model('CardInstance', CardInstanceSchema);