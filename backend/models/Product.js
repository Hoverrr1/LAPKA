const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be more than 500 characters'],
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: [0, 'Price must be at least 0'],
  },
  image: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['Food', 'Toys', 'Accessories', 'Grooming', 'Health', 'Eco-Friendly'],
  },
  subcategory: String,
  petType: String,
  ageGroup: String,
  flavor: String,
  size: String,
  material: String,
  type: String,
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  reviews: {
    type: Number,
    default: 0,
    min: 0,
  },
  stock: {
    type: Number,
    required: [true, 'Please add stock quantity'],
    min: [0, 'Stock must be at least 0'],
  },
  ecoFriendly: {
    type: Boolean,
    default: false,
  },
  slug: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

ProductSchema.pre('save', function (next) {
  this.slug = this.name.toLowerCase().replace(/\s+/g, '-');
  next();
});

module.exports = mongoose.model('Product', ProductSchema);
