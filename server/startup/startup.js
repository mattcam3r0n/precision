import { Accounts } from 'meteor/accounts-base';

Meteor.startup(function() {
    const matt = Accounts.findUserByEmail('cameron.matt@gmail.com');
    Roles.addUsersToRoles( matt._id, ['admin']);
});
