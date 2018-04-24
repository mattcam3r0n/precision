'use strict';

Meteor.methods({
  getRecentDrills: function() {
    let user = Meteor.user();
    if (!user || !user.profile || !user.profile.lastDrillId) {
      return null;
    }
    try {
      const drillMap = {};
      const recentDrillIds = getRecentDrillIds();
      const where = {
        _id: {
          $in: recentDrillIds,
        },
      };
      Drills.find(where)
        .fetch()
        .forEach((d) => {
          drillMap[d._id] = d;
        });
      return recentDrillIds
        .filter((id) => {
          return drillMap[id];
        })
        .map((id) => {
          return { _id: id, name: drillMap[id].name };
        });
    } catch (ex) {
      throwError('get-recent-drills', ex.message, ex);
    }
  },
});

function getRecentDrillIds() {
  return Meteor.user() &&
    Meteor.user().profile &&
    Meteor.user().profile.recentDrills
    ? Meteor.user().profile.recentDrills.map((id) => sanitizeId(id))
    : [];
}
