Template.upload.created = function () {
  var image = Images.findOne({
    userId: Meteor.userId()
  });
  var link = Session.get('dataUrl') || (image && image.imgurLink)
  Session.set('uploadTemplate', 'uploadOne');
  Session.set('dataUrl', link); 
}

Template.upload.helpers({
  uploadTemplate: function() {
    return Template[Session.get('uploadTemplate')];
  }
, deadlineMissedMessage: function() {
    return Session.get('deadlineMissedMessage');
  }
});

Template.uploadOne.helpers({
  imgurLink: function() {
    return Session.get('dataUrl');
  }
, date: function() {
    return moment(new Date(Config.findOne().deadline)).format('MMMM Do YYYY, h:mm a');
  }
});

Template.uploadOne.events({
  'change input[type="file"]': function (event) {
    var files = event.target.files;
    if (!files.length) { 
      return log('no file chosen');
    }
    
    var file = files[0]
      , fileReader = new FileReader();

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

    var image = Images.findOne({
      userId: Meteor.userId()
    });

    if (image) {
      Imgur.delete({
        apiKey: 'a1f8ff831c67e9b'
      , deleteHash: image.deleteHash
      }
      , function(error, data) {
          if (error) {
            return log(error);
          }

          Imgur.upload({
            apiKey: 'a1f8ff831c67e9b'
          , image: Session.get('dataUrl')
          }
          , function(error, data) {
              if (error) {
                return log(error);
              }

              var newProperties = {
                imgurLink: data.link
              , submitted: new Date().getTime()
              };

              Images.update(image._id, {
                $set: newProperties
              }
              , function(error) {
                  if (error) {
                    return log(error);
                  }
                }
              );
            }
          );
        }
      );
    }
    else {
      Imgur.upload({
        apiKey: 'a1f8ff831c67e9b'
      , image: Session.get('dataUrl')
      }
      , function(error, data) {
          if (error) {
            return log(error);
          }      

          var image = {
            userId: Meteor.userId()
          , username: Meteor.user().username
          , imgurLink: data.link
          , deleteHash: data.deletehash  
          , ratings: []
          , submitted: new Date().getTime()
          };

          Meteor.call('insertImage', image, function(error, result) {
            if (error) {
              return log(error);
            }
          });
        }
      );
    }

    Router.go('gallery');
  }
, 'click #back': function () {
    Session.set('uploadTemplate', 'uploadOne');
  }
})