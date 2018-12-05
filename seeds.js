var mongoose            = require("mongoose");
var Submtx              = require("./models/submtx");
var Comment             = require("./models/comment");

var data = [
        {
            title: "Mtx Showcase No. Ex",
            image: "https://cdn.discordapp.com/attachments/272870900615872512/519013254081675265/dad.gif",
            description: "Blah Blah Blah"
        },        
        {
            title: "Mtx Showcase No. Ex",
            image: "https://cdn.discordapp.com/attachments/272870900615872512/518943307758305310/unknown.png",
            description: "Blah Blah Blah"
        },        
        {
            title: "Mtx Showcase No. Ex",
            image: "https://cdn.discordapp.com/attachments/272870900615872512/517408360698740736/jlIvoKn.png",
            description: "Blah Blah Blah"
        }
    ]

function seedDB(){
    // remove all submtx
    Submtx.remove({}, function(err){
        if (err) {
            console.log(err)        
        } else {
            console.log("Removed Submtx")        
        }
        // add a few submtx
        data.forEach(function(seed){
            Submtx.create(seed, function(err, submtx){
                if (err) {
                    console.log(err);
                } else {
                    console.log("Added submtx");
                    //create a comment
                    Comment.create(
                        {
                            text: "This mtx looks sweet bro!",
                            author: "JimmyLgNuts"
                        }, function(err, comment){
                            if (err) {
                                console.log(err)
                            } else {
                                submtx.comments.push(comment);
                                submtx.save();
                                console.log("Added comment")
                            }
                        });
                }
            });        
        });
    });
}

module.exports = seedDB;