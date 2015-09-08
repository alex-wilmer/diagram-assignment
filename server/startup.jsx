Meteor.startup(() => {

  let admin = Meteor.users.findOne({ username: 'admin' })
    , configOptions = Config.findOne()

  if (!configOptions) {
    Config.insert({
      deadline: new Date('December 17, 2015 18:00:00')
    })
  }

  if (!admin) {
    let id = Accounts.createUser({
      username: 'admin'
    , password: 'musicwizard'
    })

    Roles.addUsersToRoles(id, ['admin'])

    // This block is just for testing.

      // loop: create users and submit a diagram for them
      _.each(range(0,19), n => {
        var user = {
              username: `student${ n }`
            , password: randomString()
            , profile: {
                submitted: true
              }
            }
          , id = Accounts.createUser(user)
          , image = {
              userId: id
            , username: user.username
            , imgurLink:
                'http://www.physik.uni-augsburg.de/chemie/Forschungsgebiete/MOFs/MOF-5.jpg'
            , ratings: []
            , submitted: new Date().getTime()
          }

        Images.insert(image)
        Passwords.insert(user)
      })
  }

  Meteor.methods({
    activateDeadline: function () {
      let admin = Meteor.users.findOne({ username: 'admin' })
      if ((admin && admin._id) === this.userId) {
        let users = Meteor.users.find({
          'profile.submitted': true
        })
        .forEach((user, index) => {
          let group = (index % 2 === 0) ? 'A' : 'B'
            , newProperties = {
                group: group
              , profile: {
                  group: group
                , submitted: user.profile.submitted
                }
              }

          Images.update({ userId: user._id }, {
            $set: {
              group: group
            }
          })

          Meteor.users.update(user._id, {
            $set: newProperties
          })
        })

        Config.update({}, {
          $set: { deadline: new Date() }
        })
      }
    }
  })
})
