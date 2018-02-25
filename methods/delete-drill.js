'use strict';

Meteor.methods({
    deleteDrill: function(id) {
        checkOwnership(id);
        Drills.remove(id);
        if (this.isSimulation) return;
        Logger.info('Drill ' + id + ' deleted by ' + Meteor.userId());
    },
});

function checkOwnership(drillId) {
  const drill = Drills.findOne(drillId);
  if (drill.userId !== Meteor.userId()) {
    throwError('not-your-drill', 'Cannot delete another user\'s drill');
  }
}
