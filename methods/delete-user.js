'use strict';

Meteor.methods({
    deleteUser: function(id) {
        const isAdmin = Roles.userIsInRole(Meteor.userId(), 'admin');
        if (!isAdmin) {
          if (!isAdmin) {
            throw new Meteor.Error(403, 'Not authorized to delete user.');
          };
        }

        Meteor.users.remove(id);
        if (this.isSimulation) return;
        Logger.info('User ' + id + ' deleted by admin.');
    },
});
