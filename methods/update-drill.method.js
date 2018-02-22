'use strict';

import { Mongo } from 'meteor/mongo';
import DrillZipper from '/lib/DrillZipper';

const zipper = new DrillZipper();

Meteor.methods({
  updateDrill: function(drill) {
    drill.updatedDate = new Date();
    drill.name_sort = drill.name.toLowerCase();
    drill.userId = Meteor.userId();
    drill.owner = Meteor.user().emails[0].address;
    Drills.update({
        _id: drill._id,
    }, {
        $set: drill,
    });
  },

  updateDrillZipped: function(zippedDrill) {
    if (this.isSimulation) return;
console.log('updateDrillZipped', zippedDrill.length);
    // unzip the drill
    const promisedResult = zipper.unzip(zippedDrill)
      .then((drill) => {
        // sanitize id
        const id = drill._id._str
          ? new Mongo.ObjectID(drill._id._str)
          : drill._id;

        // remove _id field before update
        delete drill._id;

        drill.updatedDate = new Date();
        drill.name_sort = drill.name.toLowerCase();
        drill.userId = Meteor.userId();
        drill.owner = Meteor.user().emails[0].address;
        Drills.update({
            _id: id,
        }, {
            $set: drill,
        });
      })
      .catch((ex) => {
        console.log('updateDrillZipped', ex);
        throw new Meteor.Error('updateDrillZipped', ex.message);
      });

    return promisedResult;
  },
});
