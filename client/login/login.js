Template.login.created = function() {
  Session.set('dataUrl', undefined);
}

Template.login.events({
  'submit #login-form' : function (event) {
    event.preventDefault();

    var username = event.target.username
      , password = event.target.password

    var clearFields = function() {
      username.value = '';
      password.value = ''; 
    };      

    Meteor.loginWithPassword(username.value, password.value, function(err) {
      if (err) {
        clearFields();       
        return log(err);
      }
      else if (Meteor.user().roles) {        
        Router.go('admin');
        setTimeout(clearFields, 0);
      }
      else {
        Router.go('upload');  
      }
    });
       
    return false; 
  }
});