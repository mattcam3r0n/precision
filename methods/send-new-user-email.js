'use strict';

Meteor.methods({
    sendNewUserEmail: function(info) {
        if (this.isSimulation) return;
console.log('sending new user email');
        Email.send({
            to: 'cameron.matt@gmail.com',
            from: 'cameron.matt@gmail.com',
            subject: 'New user registration',
            text: 'The contents of our email in plain text.',
          });
    },
});
