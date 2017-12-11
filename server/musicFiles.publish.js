'use strict'

Meteor.publish('musicFiles', function(options, searchString) {
  var where = {
    'title': {
//      '$regex': '.*' + (searchString || '') + '.*',
      '$regex': searchString || '',
      '$options': 'i'
    },
    // limit to users musicFiles. TODO: add publicly shared musicFiles?
    'userId': Meteor.userId()
  };
  Counts.publish(this, 'numberOfMusicFiles', MusicFiles.find(where), {noReady: true});
  return MusicFiles.find(where, options);
});
