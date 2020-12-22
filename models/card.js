var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var possibleRarities = ['Promo', 'Common', 'Uncommon', 'Rare', 'Reverse Holo', 'Rare Holo', 'Ultra Rare', 'Secret Rare', 'Other'];

var CardSchema = new Schema(
  {
    card_name: { type: String, required: true, maxlength: 75 },
    set_number: { type: Number, required: true, min: 1 },
    rarity: { 
      type: String, 
      required: true,
      enum: possibleRarities,
      default: 'Promo'
    },
    expansion: { type: Schema.Types.ObjectId, ref: 'Expansion', required: true }
  }
);

// Virtual for Card's URL
CardSchema
  .virtual('url')
  .get(function() {
    return `/catalog/card/${this._id}`;
  });

// Virtual for Card's image URL
CardSchema
  .virtual('img_url')
  .get(function() {
    return '/' + this.card_name.split(' ').join('').toLowerCase() + this.set_number.toString() + '.jpg';
  })

// Virtual for getting list of possible rarities
CardSchema
  .virtual('list_of_rarities')
  .get(function() {
    return possibleRarities;
  })

// Export model
module.exports = mongoose.model('Card', CardSchema);