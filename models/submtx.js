
// SUBMTX SCHEMA
var mongoose = require("mongoose");

// SCHEMA SET UP
var submtxSchema = new mongoose.Schema({
   title: String,
   image: String,
   description: String,
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
   // not embedding actual comment. Just embedding ref to comment
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});

module.exports = mongoose.model("Submtx", submtxSchema);