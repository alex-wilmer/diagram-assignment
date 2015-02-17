Template.upload.created = function () {
  Session.set('uploadTemplate', 'uploadOne');
  Session.set('dataUrl', undefined); 
}

Template.upload.helpers({
  uploadTemplate: function() {
    return Template[Session.get('uploadTemplate')];
  }
});

Template.uploadOne.helpers({
  dataUrl: function () {
    var image = Images.findOne({
      userId: Meteor.userId()
    });

    return image.dataUrl;
  }
});

Template.uploadOne.events({
  'change input[type="file"]': function (event) {
    var files = event.target.files;
    if (!files.length) { 
      return log('no file chosen');
    }
    
    var file = files[0];
    var fileReader = new FileReader();

    img = new Image();
    img.onload = function () {
        log(this.width + " " + this.height);
    };
    var _URL = window.URL || window.webkitURL;
    img.src = _URL.createObjectURL(file);

    fileReader.onload = function (event) { 
      var dataUrl = event.target.result;
      Session.set('dataUrl', dataUrl);
      Session.set('uploadTemplate', 'uploadTwo');
    };

    fileReader.readAsDataURL(file);
  }
});

Template.uploadTwo.helpers({
  dataUrl: function() {
    return Session.get('dataUrl');
  }
});

Template.uploadTwo.events({
  'submit #details-form': function (event) {
    event.preventDefault();

    image = {
      userId: Meteor.userId()
    , username: Meteor.user().username
    , dataUrl: Session.get('dataUrl')
    , ratings: []
    , submitted: new Date().getTime()
    };

    Meteor.call('insertImage', image, function(error, result) {
      if (error) {
        return console.log(error);
      }
      else {
        Router.go('gallery');
      }
    });
  }
, 'click #back': function () {
    Session.set('uploadTemplate', 'uploadOne');
  }
})