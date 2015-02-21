Template.userTable.helpers({
  users: function () {
    return Meteor.users.find({
      _id: {
        $ne: Meteor.userId()
      }
    });
  }
, userPassword: function (username) {
    var password = Passwords.findOne({
      username: username
    });
    return password.password;
  }
, uploaded: function (username) {
    var image = Images.findOne({
      username: username
    });

    if (image) {
      return true;
    }
  }
});