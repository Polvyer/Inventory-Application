var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ExpansionSchema = new Schema(
  {
    expansion_name: { type: String, required: true, maxlength: 45 },
    expansion_release_date: { type: Date, required: true },
    series: { type: Schema.Types.ObjectId, ref: 'Series', required: true },
    cards_in_set: { type: Number, required: true, min: 1 }
  }
);

// Virtual for cardinstance's URL
ExpansionSchema
  .virtual('url')
  .get(function() {
    return `/catalog/expansion/${this._id}`;
  });

// Export model
module.exports = mongoose.model('Expansion', ExpansionSchema);