var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CardInstanceSchema = new Schema(
  {
    card: { type: Schema.Types.ObjectId, ref: 'Card', required: true },
    condition: { type: String, required: true, maxlength: 45 },
    sale_price: { type: Schema.Types.Decimal128, required: true },
    grader: { type: String, required: true, enum: ['None', 'PSA', 'BGS'], default: 'None'},
    grade: { type: Schema.Types.Decimal128 }
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