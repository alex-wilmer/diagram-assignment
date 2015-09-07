Images = new Mongo.Collection('images')

Images.allow({
  update: (userId, image) => image && image.userId === userId
})

Meteor.methods({
  insertImage: image => {
    // do a check
    Images.insert(image)
    Meteor.users.update(Meteor.userId(), {
      $set: {
        profile: { submitted: true }
      }
    })
  }
})

Passwords = new Mongo.Collection('passwords')
Config = new Mongo.Collection('config')
