class DrillZipper {
    constructor() {
        // had trouble using import with zlib on client, so requiring on demand
        this.zlib = require('zlib');
    }

    zip(drill) {
        return new Promise((resolve, reject) => {
            console.time('zip');
            const drillString = JSON.stringify(drill);
            this.zlib.deflate(drillString, (err, buffer) => {
                if (err) {
                    reject(err);
                }
                console.timeEnd('zip');
                console.log('zipped length: ', buffer.length);
                compressedDrill = buffer.toString('base64');
                resolve(compressedDrill);
              });
        });
    }

    unzip(zippedDrillAsBase64String) {
        return new Promise((resolve, reject) => {
            console.time('unzip');
            this.zlib.inflate(new Buffer(zippedDrillAsBase64String, 'base64'), (err, unzippedBuffer) => {
              if (err) {
                  reject(err);
              } else {
                console.timeEnd('unzip');
                console.log('unzipped length: ', unzippedBuffer.length);
                const drill = JSON.parse(unzippedBuffer.toString());
                resolve(drill);
              }
            });
        });
    }
}

export default DrillZipper;
