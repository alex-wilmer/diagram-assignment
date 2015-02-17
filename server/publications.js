// Admin

Meteor.publish('users', function() {
  return Meteor.users.find();
});

Meteor.publish('passwords', function() {
  return Passwords.find();
});

// Users

Meteor.publish('images', function() {
  return Images.find();
});

Meteor.publish('imageByUserId', function(userId) {
  return Images.find({userId:userId});
});

Meteor.publish('imageById', function(id) {
  return Images.find(id);
});