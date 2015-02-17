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
    };
    Accounts.createUser(user);
    Passwords.insert(user);
  });

}