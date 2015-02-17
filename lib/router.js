Router.configure({
  layoutTemplate: 'layout'
, loadingTemplate: 'loading' 
});

Router.route('/', {
  name: 'upload'
, waitOn: function() {
    return Meteor.subscribe('imageByUserId', Meteor.userId())
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
    var date = new Date();
    var deadline = new Date('12/12/2015');
    if (date < deadline) {
      this.redirect('upload');
    }
    else {
      this.next();
    }
  }
});

/*

Router.route('/gallery/:_id', {
  name: 'imageDetails'
, waitOn: function() {
    return Meteor.subscribe('imageById', this.params._id);
  }
, data: function() {
    return Images.findOne();
  }
});*/

Router.route('/admin', {
  name: 'admin'
, waitOn: function() {
    return [
      Meteor.subscribe('users')
    , Meteor.subscribe('images')
    , Meteor.subscribe('passwords')
    ];
  }
});

Router.route('/login', {
  name: 'login'
});

var requiresLogin = function() {
  if (!Meteor.user()) {
    if (Meteor.loggingIn()) {
      this.render(this.loadingTemplate);
    }
    else {
      this.redirect('login');
    }
  }
  else {
    this.next();
  }
}

Router.onBeforeAction(requiresLogin, {
  only: ['upload']
});

var requiresAdmin = function() {
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
};

Router.onBeforeAction(requiresAdmin, {
  only: ['admin']
});

var signedIn = function() {
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
};

Router.onBeforeAction(signedIn, {
  only: ['login']
});

