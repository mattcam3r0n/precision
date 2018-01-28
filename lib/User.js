import { Meteor } from 'meteor/meteor';

class User {
    static getUser() {
        return Meteor.user();
    }

    static getUserId() {
        let user = Meteor.user();
        if (!user || !user._id) {
            return null;
        }

        return user._id;
    }

    static getUserEmail() {
        let user = Meteor.user();
        if (!user || !user.emails || user.emails.length == 0) {
            return null;
        }

        return user.emails[0].address;
    }
}

export default User;
