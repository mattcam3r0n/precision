class FileUploader {
    static upload(file) {
        if (!file) return;

        return new Promise((resolve, reject) => {
            const uploader = new Slingshot.Upload('uploadToAmazonS3');
            uploader.send(file, (error, url) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(url);
                }
            });
        });
    }

    static key(file) {
        return Meteor.userId() + '/' + file.name;
    }
}

export default FileUploader;
