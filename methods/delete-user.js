'use strict';

Meteor.methods({
    deleteUser: function(id) {
        if (this.isSimulation) return;

        const isAdmin = Roles.userIsInRole(Meteor.userId(), 'admin');
        if (!isAdmin) {
          if (!isAdmin) {
            throw new Meteor.Error(403, 'Not authorized to delete user.');
          };
        }

        Meteor.users.remove(id);
    },
});
