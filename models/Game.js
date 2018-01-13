var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
var Game = new Schema({
  // `title` is required and of type String
  date: {
    type: String,
    required: true
  },
  // `link` is required and of type String
  kickoff: {
    type: String,
    required: true,
    unique: true
  },
  gameID: {
    type: String,
    required: false
  },
  away: {
    type: String,
    required: true
  },
  away_code: {
    type: String,
    required: false
  },
  home: {
    type: String,
    required: true
  },
  home_code: {
    type: String,
    required: false
  },
  away_line: {
    type: Number,
    required: false
  },
  away_SRS: {
    type: Number,
    required: false
  },
  home_line: {
    type: Number,
    required: false
  },
  home_SRS: {
    type: Number,
    required: false
  },
  predictor: {
    type: Number,
    required: false
  },
  bet: {
    type: String,
    required: false
  },
  away_score: {
    type: Number,
    required: false
  },
  home_score: {
    type: Number,
    required: false
  },
  result: {
    type: String,
    required: false
  }, 
  created_at: { 
    type: Date 
  }, 
  updated_at: { 
    type: Date 
  }
});


Game.pre('save', function(next){
  now = new Date();
  this.updated_at = now;
  if ( !this.created_at ) {
    this.created_at = now;
  }
  next();
});

// This creates our model from the above schema, using mongoose's model method
var Game = mongoose.model("Game", Game);

// Export the Article model
module.exports = Game;
