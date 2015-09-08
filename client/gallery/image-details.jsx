Template.imageDetails.created = function () {
  let image = Images.findOne(this.data._id)
  if (image.ratings) {
    image.ratings.forEach(item => {
      if (item.userId === Meteor.userId()) {
        let selector =
          `.rating .star:nth-child(${ weirdInvert(item.rating) })`

        setTimeout(() => {
          $(selector).prop('checked', true)
        },0)
      }
    })
  }
}

Template.imageDetails.events({
  'click .star': function (event) {
    let rating =  {
      userId: Meteor.userId()
    , rating: event.target.id.split('').pop()
    }

    let image = Images.findOne(this._id)

    let alreadyVoted =
      image.ratings.some(x => x.userId === Meteor.userId())

    if (!alreadyVoted) {
      Images.update(this._id, {
        $push: { ratings: rating }
      })
    }
  }
, 'click #back': function () {
    Router.go('gallery')
  }
})
