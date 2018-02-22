'use strict';

// import { Mongo } from 'meteor/mongo';
import DrillZipper from '/lib/DrillZipper';

const zipper = new DrillZipper();

Meteor.methods({
  getDrill: function(id) {
    // return a value
    return Drills.findOne(id);
  },

  getDrillZipped: function(id) {
    if (this.isSimulation) return;

    // sanitize id
    const sanitizedId = id._str
      ? new Mongo.ObjectID(id._str)
      : id;

    console.log('getDrillZipped', sanitizedId);
    console.time('find drill');
    const drill = Drills.findOne(sanitizedId);
    console.timeEnd('find drill');
    console.log('getDrillZipped drill is null', drill ? 'no' : 'yes');
    const promisedResult = zipper.zip(drill)
      .then((zippedDrill) => {
        return zippedDrill;
      });

    return promisedResult;
  },
});
