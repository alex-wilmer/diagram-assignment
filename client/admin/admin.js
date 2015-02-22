Template.layout.created = function() {
  Session.set('searchTerm', undefined); 
}

Template.layout.helpers({
  deadlineLoaded: function() {
    return Session.get('deadline');
  }
, deadlinePassed: function() {
    return Session.get('deadlinePassed');
  }
});

Template.layout.events({
  'keydown .search-input': function (event) {
    setTimeout(function() {
      Session.set('searchTerm', event.target.value);
    }, 0);
  }
, 'click #activate-deadline': function() {
    Meteor.call('activateDeadline', undefined, function(error, result) {
      if (error) {
        return log(error);
      }

      Session.set('deadlinePassed', true);
    });
  }
});

Template.userTable.helpers({
  users: function () {
    var searchTerm = Session.get('searchTerm');
    if (searchTerm) {
      return Meteor.users.find({
        username: new RegExp(searchTerm, 'i')
      });
    }
    else {
      return Meteor.users.find({
        _id: {
          $ne: Meteor.userId()
        }
      });
    }
  }
, userPassword: function (username) {
    if (Meteor.user()) {
      var password = Passwords.findOne({
        username: username
      });
      return password.password;
    }
  }
, ratingsCount: function (username) {
    var image = Images.findOne({
      username: username
    });
    return image && image.ratings.length;
  }
, average: function (username) {
    var image = Images.findOne({
      username: username
    });
    if (image && !!image.ratings.length) {
      var average = 0;
      image.ratings.forEach(function(rating) {
        average += rating.rating;
      });
      return average / image.ratings.length;
    }
  }
});