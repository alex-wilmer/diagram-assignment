Router.configure({
  layoutTemplate: 'layout'
, loadingTemplate: 'loading' 
});

Router.route('/', {
  name: 'uploader'
// , waitOn: function() {
//     return Meteor.subscribe('imageByUserId', Meteor.userId());    
//   }
});

/*Router.route('/gallery', {
  name: 'gallery'
, waitOn: function() {
   return Meteor.subscribe('images');
  }
, data: function() {
    return {
      images: Images.find({}, {sort: {submitted: 1}})
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
});*/

Router.route('/admin', {
  name: 'admin'
, waitOn: function() {
    return [
      Meteor.subscribe('users')
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
  only: ['uploader']
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
    this.redirect('uploader');
  }
  else {
    this.next();
  }
}

Router.onBeforeAction(requiresAdmin, {
  only: ['admin']
});

