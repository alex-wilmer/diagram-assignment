Template.userTable.helpers({
  users: function () {
    return Meteor.users.find({
      _id: {
        $ne: Meteor.userId()
      }
    });
  }
, userPassword: function (username) {
    if (Meteor.user()) {
      var password = Passwords.findOne({
        username: username
      });
      return password.password;
    }
  }
, uploaded: function (username) {
    var image = Images.findOne({
      username: username
    });

    if (image) {
      return true;
    }
  }
, ratings: function (username) {
    var image = Images.findOne({
      username: username
    });
    return image && 'Submitted';
  }
});