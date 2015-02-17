Template.layout.helpers({
  username: function() {
    var user = Meteor.user();
    if (user) {
      return user.username;
    }
  }
})

Template.layout.events({
  'click .logout': function() {
    Meteor.logout();
    setTimeout(function() {
      Router.go('login');
    }, 100);
  }
});