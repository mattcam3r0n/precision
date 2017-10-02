Meteor.startup(function() {
  if(Drills.find().count() === 0) {
    var drills = [
      {
        'name': 'drill 1'
      },
      {
        'name': 'drill 2'
      }
    ];
    drills.forEach(function(drill) {
      Drills.insert(drill);
    });
  }
});