Drills = new Mongo.Collection('drills');

Drills.allow({
  insert: function(userId, drill) {
    drill.createdDate = new Date();
    drill.updatedDate = new Date();
    drill.userId = Meteor.userId();
    drill.owner = Meteor.user().emails[0];
    drill.name_sort = drill.name.toLowerCase();
    return userId;
  },
  update: function(userId, drill, fields, modifier) {
    drill.updatedDate = new Date();
    drill.name_sort = drill.name.toLowerCase();
    drill.userId = Meteor.userId();
    drill.owner = Meteor.user().emails[0];
    return userId && drill.owner == userId;
  },
  remove: function(userId, drill) {
    return userId && drill.owner == userId;
  }
});