'use strict';
const versionInfo = require('../public/version.json');

Meteor.methods({
  getVersion: function() {
    return versionInfo.version;
  },
});
