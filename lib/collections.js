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
    Meteor.users.update(Meteor.userId(), {
      $set: {
        profile: {
          submitted: true
        }
      }
    });
  }
});

Passwords = new Mongo.Collection('passwords');
Config = new Mongo.Collection('config');