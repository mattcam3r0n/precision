'use strict';

import { Mongo } from 'meteor/mongo';
import DrillZipper from '/lib/DrillZipper';

const zipper = new DrillZipper();

Meteor.methods({
  updateDrill: function(drill) {
    updateDrill(drill);
  },

  updateDrillZipped: function(zippedDrill) {
    if (this.isSimulation) return;
    // unzip the drill
    const promisedResult = zipper.unzip(zippedDrill)
      .then((drill) => {
        updateDrill(drill);
      })
      .catch((ex) => {
        throwError('updateDrillZipped', ex.message, ex);
      });

    return promisedResult;
  },
});

function updateDrill(drill) {
  checkOwnership(drill);

  // sanitize id
  const id = drill._id._str
    ? new Mongo.ObjectID(drill._id._str)
    : drill._id;

  // remove _id field before update
  delete drill._id;

  // remove $$hashKey from bookmarks
  sanitizeBookmarks(drill);

  drill.updatedDate = new Date();
  drill.name_sort = drill.name.toLowerCase();
  drill.userId = Meteor.userId();
  drill.owner = Meteor.user().emails[0].address;
  Drills.update({
    _id: id,
  }, {
      $set: drill,
    });
}

function checkOwnership(drill) {
  if (drill.userId && drill.userId !== Meteor.userId()) {
    throwError('not-your-drill', 'Cannot update another user\'s drill', {
      drillUserId: drill.userId,
      userId: Meteor.userId(),
    });
  }
}
