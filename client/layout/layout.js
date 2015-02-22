Template.layout.helpers({
  username: function() {
    var user = Meteor.user();
    if (user) {
      return user.username;
    }
  }
, adminPage: function() {
    return Router.current().route.getName() === 'admin';
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