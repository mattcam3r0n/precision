import { Accounts } from 'meteor/accounts-base';

Meteor.startup(function() {
    Accounts.from = Meteor.settings.ADMIN_EMAIL || 'no-reply@precision.nammb.org';
    Accounts.siteName = 'precision.nammb.org';
    Accounts.emailTemplates.resetPassword.from = function(user) {
        return Meteor.settings.ADMIN_EMAIL || 'no-reply@precision.nammb.org';
    };
    Accounts.emailTemplates.resetPassword.subject = function(user) {
        return 'Precision - Password Reset Instructions';
    };
    Accounts.emailTemplates.resetPassword.html = function(user, url) {
        try {
            SSR.compileTemplate('passwordResetEmail', Assets.getText('password-reset-email.html'));

            const newUrl = url.replace('#/reset-password', 'forgot-password') + '/';

            let emailData = {
                firstName: user.profile.firstName,
                lastName: user.profile.lastName,
                orgName: user.profile.orgName,
                email: user.emails[0].address,
                url: newUrl,
            };

            return SSR.render('passwordResetEmail', emailData);
        } catch (ex) {
            console.log('resetPassword.html()', ex);
            throwError('password-reset-email-failed', 'Error sending password reset email.', ex);
        }
    };

    // Accounts.verifyEmail ... same options as resetPassword
});
