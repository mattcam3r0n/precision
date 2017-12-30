class AudioBufferLoader {
    constructor(context) {
        this.context = context;
        this.buffers = {};
    }

    load(urlList) {
        urlList = this.makeArray(urlList);
        var promises = [];
        for (var i = 0; i < urlList.length; ++i) {
            let url = urlList[i];
            if (!this.buffers[url])
                promises.push(this.loadBuffer(url));
        }

        return Promise.all(promises).then(() => {
            return this.buffers;
        });
    }

    makeArray(val) {
        if (Array.isArray(val))
            return val;

        return [val];
    }

    getBuffer(url) {
        return this.buffers[url];
    }

    isBuffered(url) {
        return !!this.buffers[url];
    }

    loadBuffer(url) {
        var loader = this;
        return new Promise((resolve, reject) => {
            // Load buffer asynchronously
            var request = new XMLHttpRequest();
            request.open("GET", url, true);
            request.responseType = "arraybuffer";

            request.onload = function () {
                // Asynchronously decode the audio file data in request.response
                loader.context.decodeAudioData(
                    request.response,
                    function (buffer) {
                        if (!buffer) {
                            reject({ status: this.status , statusText: 'error decoding file data: ' + url });
                            return;
                        }
                        loader.buffers[url] = buffer;
                        resolve(buffer);
                    },
                    function (error) {
                        console.error('decodeAudioData error', error, url);
                        reject(error);
                    }
                );
            }

            request.onerror = function () {
                reject('BufferLoader: XHR error');
            }

            request.send();
        });

    }

}

export default AudioBufferLoader;