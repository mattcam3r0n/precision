Meteor.startup(function() {
  if(MusicFiles.find().count() === 0) {
    var musicFiles = [
      {
        'name': 'drill 1'
      },
      {
        'name': 'drill 2'
      }
    ];
    musicFiles.forEach(function(musicFile) {
      MusicFiles.insert(musicFile);
    });
  }
});