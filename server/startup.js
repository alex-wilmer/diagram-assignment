Meteor.startup(function () {

  var admin = Meteor.users.findOne({username:'admin'})
    , deadline = 
        moment('2015 10 25 5 30', 'YYYY MM DD H mm')
          .format('M/D/YYYY H:mm A');

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
          submitted: false
        }    
      };
      Accounts.createUser(user);
      Passwords.insert(user);
    });
  }

  Meteor.methods({
    getDeadline: function() {
      return deadline;
    }
  , activateDeadline: function() { 
      var admin = Meteor.users.findOne({username:'admin'})
      if ((admin && admin._id) === this.userId) {
        var users = Meteor.users.find({
          'profile.submitted': true
        })
        .forEach(function(user, index) {
          var group = (index % 2 === 0) ? 'A' : 'B'
            , newProperties = {
                group: group
              , profile: {
                  group: group
                , submitted: user.profile.submitted
                }
              };

          Images.update({userId: user._id}, {
            $set: {
              group: group
            }
          });     

          Meteor.users.update(user._id, {
            $set: newProperties 
          });
        });

        return deadline = new Date(); 
      }
    }
  });
});
