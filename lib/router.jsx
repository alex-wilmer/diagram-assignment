Router.configure({
  layoutTemplate: 'layout'
, loadingTemplate: 'loading'
})

Router.route('/login', {
  name: 'login'
, onBeforeAction: function () {
    if (Meteor.user()) {
      if (Meteor.user().roles) {
        this.redirect('admin')
      }
      else {
        this.redirect('upload')
      }
    }
    else {
      this.next()
    }
  }
})

Router.route('/', {
  name: 'upload'
, waitOn: function () {
    return [
      Meteor.subscribe('imageByUserId', Meteor.userId())
    , Meteor.subscribe('config')
    ]
  }
, onBeforeAction: function () {
    if (!Meteor.user()) {
      if (Meteor.loggingIn()) {
        this.render(this.loadingTemplate)
      }
      else {
        this.redirect('login')
      }
    }
    else if (Meteor.user().roles) {
      this.redirect('admin')
    }
    else {

      let date = new Date()
        , deadline = Config.findOne().deadline

      console.log(date, deadline)

      if (date > deadline) {
        let image = Images.findOne()
        if (image) {
          this.redirect('gallery')
        }
        else if (Meteor.isClient) {
          Session.set('deadlineMissedMessage',
            'You missed the deadline.'
          )
        }
      }

      this.next()
    }
  }
})

Router.route('/gallery', {
  name: 'gallery'
, waitOn: function () {
    return [
      Meteor.subscribe('images')
    , Meteor.subscribe('config')
    ]
  }
, data: function () {
    if (Meteor.user()) {
      return {
        images: Images.find({
          _id: { $in: Meteor.user().profile.imagesToRate }
        })
      }
    }
  }
, onBeforeAction: function () {
    let date = new Date()
      , deadline = Config.findOne().deadline

    if (date < deadline) {
      this.redirect('upload')
    }
    else {
      this.next()
    }
  }
})

Router.route('/gallery/:_id', {
  name: 'imageDetails'
, waitOn: function () {
    return Meteor.subscribe('imageById', this.params._id)
  }
, data: function () {
    return Images.findOne()
  }
})

Router.route('/admin', {
  name: 'admin'
, waitOn: function () {
    return [
      Meteor.subscribe('users')
    , Meteor.subscribe('images')
    , Meteor.subscribe('passwords')
    , Meteor.subscribe('config')
    ]
  }
, onBeforeAction: function () {
    if (!Meteor.user()) {
      if (Meteor.loggingIn()) {
        this.render(this.loadingTemplate)
      }
      else {
        this.redirect('login')
      }
    }
    else if (!Meteor.user().roles) {
      this.redirect('upload')
    }
    else {
      this.next()
    }
  }
})

Router.route('/:default', {
  onBeforeAction: function () {
    this.redirect('upload')
  }
})
