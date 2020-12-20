var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CardSchema = new Schema(
  {
    card_name: { type: String, required: true, maxlength: 75 },
    set_number: { type: Number, required: true, min: 1 },
    rarity: { type: String, required: true, maxlength: 30 },
    expansion: { type: Schema.Types.ObjectId, ref: 'Expansion', required: true }
  }
);

// Virtual for cardinstance's URL
CardSchema
  .virtual('url')
  .get(function() {
    return `/catalog/card/${this._id}`;
  });

// Export model
module.exports = mongoose.model('Card', CardSchema);