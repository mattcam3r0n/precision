'use strict';
const versionInfo = require('../public/version.json');

Meteor.methods({
  getVersion: function() {
    // if (this.isSimulation) return;
    console.log(versionInfo);
    return versionInfo.version;
  // if (Meteor.isServer) {
  //   }
  },
});
