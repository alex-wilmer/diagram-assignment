Meteor.startup(function () {

  var admin = Meteor.users.findOne({username:'admin'});

  if (!admin) {

    var id = Accounts.createUser({
      username: 'admin'
    , password: 'musicwizard'
    });

    Roles.addUsersToRoles(id, ['admin']);

    _.each(range(0,10), function(n) {
      var user = {
        username: 'student' + n
      , password: randomString()
      , profile: {
          group: n % 2 == 0 ? 'A' : 'B'
        }      
      };
      Accounts.createUser(user);
      Passwords.insert(user);
    });
  }

  var deadline = 
    moment('2015 10 25 5 30', 'YYYY MM DD H mm').format('M/D/YYYY H:mm A');

  Meteor.methods({
    getDeadline: function() {
      return deadline;
    }
  });
});