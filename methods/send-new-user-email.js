'use strict';

Meteor.methods({
    sendNewUserEmail: function(info) {
        if (this.isSimulation) return;

        SSR.compileTemplate('newUserEmail', Assets.getText('new-user-email.html'));

        let emailData = {
          name: info.firstName + ' ' + info.lastName,
          orgName: info.orgName,
          email: info.email,
        };

        Email.send({
          to: Meteor.settings.ADMIN_EMAIL,
          from: Meteor.settings.ADMIN_EMAIL,
          subject: 'New Precision User',
          html: SSR.render('newUserEmail', emailData),
        });
    },
});
