Drills = new Mongo.Collection('drills');

Drills.allow({
  insert: function(userId, drill) {
    return userId;
  },
  update: function(userId, drill, fields, modifier) {
    return userId && drill.owner == userId;
  },
  remove: function(userId, drill) {
    return userId;
  }
});