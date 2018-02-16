import { Accounts } from 'meteor/accounts-base';

Meteor.startup(function() {
    const matt = Accounts.findUserByEmail('cameron.matt@gmail.com');
    if (matt) {
        Roles.addUsersToRoles( matt._id, ['admin']);
    }

    const nammb = Accounts.findUserByEmail('nammb.org@gmail.com');
    if (nammb) {
        Roles.addUsersToRoles( nammb._id, ['admin']);
    }
});
