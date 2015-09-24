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
      let user = {
        username: `student${ n }`
      , password: randomString()
      , profile: { submitted: true }
      }
          
      let image = {
        userId: Accounts.createUser(user)
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

        // Find all users that have submitted an image.
        let users = Meteor.users.find({ 'profile.submitted': true })

        users.forEach((user, index) => {

          // Assign them to group A or B (odd / even)
          let group = (index % 2 === 0) ? 'A' : 'B'

          // Update their images to add which group they're part of
          Images.update({ userId: user._id }, {
            $set: { group }
          })

          // Update user info
          Meteor.users.update(user._id, {
            $set: {
              profile: {
                submitted: true
              , group
              }
            , group
            }
          })
        })

        // Find all images that have a group assigned
        let images = Images.find({ group: { $exists: 1 }}).fetch()

        // Split images into two arrays, one per group
        let imagesA = images.filter(x => x.group === 'A')
        let imagesB = images.filter(x => x.group === 'B')

        users.forEach(user => {
          let { group } = user.profile
          let imagesToRate = []

          for (let i = 0; i < 5; i++) {
            imagesToRate = [
              ...imagesToRate
            , group === 'A' ? spliceImage(imagesB)._id : spliceImage(imagesA)._id
            ]

            if (!imagesA.length) imagesA = images.filter(x => x.group === 'A')
            if (!imagesB.length) imagesB = images.filter(x => x.group === 'B')
          }

          Meteor.users.update(user._id, {
            $set: {
              profile: {
                submitted: true
              , group
              , imagesToRate
              }
            , group
            , imagesToRate
            }
          })
        })

        Config.update({}, {
          $set: { deadline: new Date() }
        })
      }
    }
  })
})
