'use strict';

Meteor.publish('musicFiles', function(options, searchText, searchFiles, searchClips, searchNammb) {
  let where = {
    'title': {
      '$regex': searchText || '',
      '$options': 'i',
    },
    // limit to files and/or clips
    'type': { $in: getTypes(searchFiles, searchClips) },
  };

  if (searchNammb) {
    where.isPublic = true;
  } else {
    where.userId = Meteor.userId();
  }

// console.log(where);

  Counts.publish(this, 'numberOfMusicFiles', MusicFiles.find(where), {noReady: true}); //eslint-disable-line
  return MusicFiles.find(where, options);
});

function getTypes(searchFiles, searchClips) {
  let values = [];

  if (searchClips) {
    values.push('clip');
}

  if (searchFiles) {
    values.push('file');
}

  return values;
}
