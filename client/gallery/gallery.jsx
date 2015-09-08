Template.gallery.helpers({
  alreadyVoted: function (image) {
    let alreadyVoted = false

    if (image.ratings.length) {
      alreadyVoted =
        image.ratings.some(i => i.userId === Meteor.userId())
    }

    return alreadyVoted ? '' : 'display: none'
  }
})
