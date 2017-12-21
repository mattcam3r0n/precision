'use strict'

Meteor.publish('musicFiles', function(options, searchText, searchFiles, searchClips) {
  console.log(searchText, searchFiles, searchClips);
  var where = {
    'title': {
      '$regex': searchText || '',
      '$options': 'i'
    },
    // limit to users musicFiles. TODO: add publicly shared musicFiles?
    //'userId': Meteor.userId(),
    $or : [
      { 'userId': Meteor.userId() },
      { 'isPublic': true }
    ],
    // limit to files and/or clips
    'type': { $in: getTypes(searchFiles, searchClips) }
  };

//console.log(where);

  Counts.publish(this, 'numberOfMusicFiles', MusicFiles.find(where), {noReady: true});
  return MusicFiles.find(where, options);
});

function getTypes(searchFiles, searchClips) {
  var values = [];

  if (searchClips) 
    values.push('clip');

  if (searchFiles)
    values.push('file');

  return values;
}