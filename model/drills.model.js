Drills = new Mongo.Collection('drills');

Drills.allow({
  insert: function(userId, drill) {
    drill.createdDate = new Date();
    drill.updatedDate = new Date();
    drill.userId = Meteor.userId();
    drill.owner = getOwnerEmail(Meteor.user());
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

function getOwnerEmail(user) {
  if (!user || !user.emails || user.emails.length == 0)
    return 'unknown';
  
  return user.emails[0].address;
}