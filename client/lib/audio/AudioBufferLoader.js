class AudioBufferLoader {
    constructor(context, urlList) {
        this.context = context;
        this.urlList = urlList;
        this.buffers = {};
    }

    load() {
        var promises = [];
        for (var i = 0; i < this.urlList.length; ++i) {
            promises.push(this.loadBuffer(this.urlList[i], i));
        }

        return Promise.all(promises).then(() => {
            console.log(this.buffers);
            return this.buffers;
        });
    }

    getBuffer(url) {
        return this.buffers[url];
    }

    loadBuffer(url, index) {
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