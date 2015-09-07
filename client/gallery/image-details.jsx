Template.imageDetails.created = () => {
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
    if (!image.ratings.length) {
      Images.update(this._id, {
        $push: { ratings: rating }
      })
    }
    else {
      image.ratings.forEach(item => {
        if (item.userId === Meteor.userId())
          item.rating = event.target.id.split('').pop()
      })
      
      Images.update(this._id, {
        $set: { ratings: image.ratings }
      })
    }

  }
, 'click #back': function () {
    Router.go('gallery')
  }
})
