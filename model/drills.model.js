Drills = new Mongo.Collection('drills');

Drills.allow({
  insert: function(userId, drill) {
    drill.createdDate = new Date();
    drill.updatedDate = new Date();
    drill.userId = Meteor.userId();
    drill.owner = Meteor.user().emails[0].address;
    drill.name_sort = drill.name.toLowerCase();
    return userId;
  },
  update: function(userId, drill, fields, modifier) {
    return userId && drill.userId == userId;
  },
  remove: function(userId, drill) {
    return userId && drill.userId == userId;
  }
});