Images = new Mongo.Collection('images');

Meteor.methods({
  insertImage: function(image) {
    // do a check

    Images.insert(image);
  }
});

Passwords = new Mongo.Collection('passwords');