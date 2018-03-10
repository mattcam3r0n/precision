import FileUploader from '/lib/FileUploader';

Slingshot.fileRestrictions('uploadToAmazonS3', {
    allowedFileTypes: ['audio/midi',
        'audio/mpeg',
        'audio/mp3',
        'audio/webm',
        'audio/ogg',
        'audio/wav',
        'audio/m4a',
     ],
    maxSize: 20 * 1024 * 1024,
});

Slingshot.createDirective('uploadToAmazonS3', Slingshot.S3Storage, {
    region: 'us-east-2',
    bucket: 'precision-audio',
    acl: 'public-read',
    authorize: function() {
        // let userFileCount = Files.find({ "userId": this.userId }).count();
        // return userFileCount < 3 ? true : false;
        // TODO: logic to authorize file upload goes here...
        //   * logged in?
        //   * has upload permissions?
        return Meteor.userId();
    },
    key: function(file) {
        // var user = Meteor.users.findOne(this.userId);
        // return user.emails[0].address + "/" + file.name;
        // TODO: logic to generate unique key (file name) goes here
        return FileUploader.key(file);
    },
});
