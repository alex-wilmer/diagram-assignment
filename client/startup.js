Meteor.startup(function() {
  Meteor.call('getDeadline', function(err, result) {
    Session.set('deadline', result);
  });
});