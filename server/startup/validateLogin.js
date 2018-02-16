import { Accounts } from 'meteor/accounts-base';

Accounts.validateLoginAttempt(function(attempt) {
    if (!attempt.user) {
        return false;
    }

    const isDisabled = Roles.userIsInRole(attempt.user._id, 'disabled');
    if (isDisabled) {
        throw new Meteor.Error(403, 'Your account is disabled.');
    }
    return true;
});
