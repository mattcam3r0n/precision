class DrillZipper {
    constructor() {
        // had trouble using import with zlib on client, so requiring on demand
        this.zlib = require('zlib');
    }

    zip(drill) {
        return new Promise((resolve, reject) => {
            const drillString = JSON.stringify(drill);
            this.zlib.deflate(drillString, (err, buffer) => {
                if (err) {
                    reject(err);
                }
                compressedDrill = buffer.toString('base64');
                resolve(compressedDrill);
              });
        });
    }

    unzip(zippedDrillAsBase64String) {
        return new Promise((resolve, reject) => {
            this.zlib.inflate(new Buffer(zippedDrillAsBase64String, 'base64'), (err, unzippedBuffer) => {
              if (err) {
                  reject(err);
              } else {
                const drill = JSON.parse(unzippedBuffer.toString());
                resolve(drill);
              }
            });
        });
    }
}

export default DrillZipper;
