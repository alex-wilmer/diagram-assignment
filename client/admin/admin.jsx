Template.layout.created = () => Session.set('searchTerm', undefined)

Template.layout.helpers({
  deadlinePassed: function () {
    let date = new Date()
    if (Config.findOne())
      return date > Config.findOne().deadline
  }
})

Template.layout.events({
  'keydown .search-input': function (event) {
    setTimeout(() => {
      Session.set('searchTerm', event.target.value)
    }, 0)
  }
, 'click #activate-deadline': function () {
    Meteor.call('activateDeadline', undefined, function(error, result) {
      if (error) {
        return log(error)
      }
    })
  }
})

Template.userTable.helpers({
  users: function () {
    let searchTerm = Session.get('searchTerm')
    if (searchTerm) {
      return Meteor.users.find({
        username: new RegExp(searchTerm, 'i')
      })
    }
    else {
      return Meteor.users.find({
        _id: {
          $ne: Meteor.userId()
        }
      })
    }
  }
, userPassword: function (username) {
    if (Meteor.user()) {
      let password = Passwords.findOne({ username })
      return password.password
    }
  }
, ratingsCount: function (username) {
    let image = Images.findOne({ username })
    return image && image.ratings.length
  }
, average: function (username) {
    let image = Images.findOne({ username })
    if (image && image.ratings.length) {
      let total = image.ratings
        .map(x => +x.rating)
        .reduce((a, b) => a + b)

      return total / image.ratings.length
    }
  }
})
