Template.uploader.created = function () {
  Session.set('uploadTemplate', 'uploadOne');
  Session.set('dataUrl', undefined); 
}

Template.uploader.helpers({
  uploadTemplate: function() {
    return Template[Session.get('uploadTemplate')];
  }
});

Template.uploadOne.events({
  'change input[type="file"]': function (event, template) {
    var files = event.target.files;
    if (!files.length) 
      return;
    
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
    , dataUrl: Session.get('dataUrl')
    , title: $('#title').val()
    , notes: $('#notes').val()
    , ratings: []
    , submitted: new Date().getTime()
    };

    Images.insert(image);
    Router.go('gallery');

  }
, 'click #back': function () {
    Session.set('uploadTemplate', 'uploadOne');
  }
})