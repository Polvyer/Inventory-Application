var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var SeriesSchema = new Schema(
  {
    series_name: { type: String, required: true, maxlength: 45 },
    series_release_date: { type: Date, required: true }
  }
);

// Virtual for cardinstance's URL
SeriesSchema
  .virtual('url')
  .get(function() {
    return `/catalog/series/${this._id}`;
  });

// Export model
module.exports = mongoose.model('Series', SeriesSchema);