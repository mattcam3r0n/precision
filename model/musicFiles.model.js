MusicFiles = new Mongo.Collection('musicFiles');

MusicFiles.allow({
  insert: function(userId, musicFile) {
    return userId;
  },
  update: function(userId, musicFile, fields, modifier) {
    return userId && musicFile.userId == userId;
  },
  remove: function(userId, musicFile) {
    return userId && musicFile.userId == userId;
  }
});

