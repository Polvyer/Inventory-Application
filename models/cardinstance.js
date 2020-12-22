var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CardInstanceSchema = new Schema(
  {
    card: { type: Schema.Types.ObjectId, ref: 'Card', required: true },
    condition: { 
      type: String, 
      required: true, 
      enum: ['Near Mint', 'Lightly Played', 'Moderately Played', 'Heavily Played', 'Damaged', 'Heavily Damaged'],
      default: 'Near Mint',
    },
    sale_price: { type: Schema.Types.Decimal128, required: true },
    grader: { 
      type: String,
      required: true,
      enum: ['None', 'PSA', 'BGS', 'Other'], 
      default: 'None'
    },
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