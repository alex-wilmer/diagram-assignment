Images = new Mongo.Collection('images');

Images.allow({
  update: function(userId, image) {
    return image && image.userId === userId;
  }
});

Meteor.methods({
  insertImage: function(image) {
    // do a check

    Images.insert(image);
  }
});

Passwords = new Mongo.Collection('passwords');