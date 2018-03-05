'use strict';

Meteor.methods({
    sendWelcomeEmail: function(info) {
        if (this.isSimulation) return;

        SSR.compileTemplate('welcomeEmail', Assets.getText('welcome-email.html'));

        let emailData = {
          firstName: info.firstName,
          lastName: info.lastName,
          name: info.firstName + ' ' + info.lastName,
          orgName: info.orgName,
          email: info.email,
        };

        Email.send({
          to: info.email,
          from: Meteor.settings.ADMIN_EMAIL,
          subject: 'Precision - Welcome!',
          html: SSR.render('welcomeEmail', emailData),
        });
    },
});
