Router.configure({
  layoutTemplate: 'layout'
, loadingTemplate: 'loading'
});

Router.route('/login', {
  name: 'login'
, onBeforeAction: function() {
    if (Meteor.user()) {    
      if (Meteor.user().roles) {
        this.redirect('admin');
      }
      else {
        this.redirect('upload')
      }
    }
    else {
      this.next();
    }
  }
});

Router.route('/', {
  name: 'upload'
, waitOn: function() {
    return Meteor.subscribe('imageByUserId', Meteor.userId())
  }
, onBeforeAction: function() {
    if (!Meteor.user()) {
      if (Meteor.loggingIn()) {
        this.render(this.loadingTemplate);
      }
      else {
        this.redirect('login');
      }
    }
    else if (Meteor.user().roles) {
      this.redirect('admin');
    }
    else {
      this.next();
    }
  }
});

Router.route('/gallery', {
  name: 'gallery'
, waitOn: function() {
   return Meteor.subscribe('images');
  }
, data: function() {
    return {
      images: Images.find({}, {sort: {submitted: 1}})
    }
  }
, onBeforeAction: function() {
    var date = new Date(),
        deadline = new Date(Session.get('deadline'));

    if (date < deadline) {
      this.redirect('upload');
    }
    else {
      this.next();
    }
  }
});

Router.route('/gallery/:_id', {
  name: 'imageDetails'
, waitOn: function() {
    return Meteor.subscribe('imageById', this.params._id);
  }
, data: function() {
    return Images.findOne();
  }
})

Router.route('/admin', {
  name: 'admin'
, waitOn: function() {
    return [
      Meteor.subscribe('users')
    , Meteor.subscribe('images')
    , Meteor.subscribe('passwords')
    ];
  }
, onBeforeAction: function() {
    if (!Meteor.user()) {
      if (Meteor.loggingIn()) {
        this.render(this.loadingTemplate);
      }
      else {
        this.redirect('login');
      }
    }
    else if (!Meteor.user().roles) {
      this.redirect('upload');
    }
    else {
      this.next();
    }
  }
});

Router.route('/:default', {
  onBeforeAction: function() {
    this.redirect('upload');
  }
});

