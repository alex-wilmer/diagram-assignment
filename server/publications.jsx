// Admin

Meteor.publish('config', () => Config.find())

Meteor.publish('users', () => Meteor.users.find())

Meteor.publish('passwords', () => Passwords.find())

// Users

Meteor.publish('images', () => Images.find())

Meteor.publish('imageByUserId', userId => Images.find({ userId }))

Meteor.publish('imageById', id => Images.find(id))
