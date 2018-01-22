Meteor.startup(function() {
  if (Drills.find().count() === 0) {
    let drills = [
      {
        'name': 'drill 1',
      },
      {
        'name': 'drill 2',
      },
    ];
    drills.forEach(function(drill) {
      Drills.insert(drill);
    });
  }
});
