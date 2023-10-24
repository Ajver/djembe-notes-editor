window.AudioContext = window.AudioContext || window.webkitAudioContext;

const context = new AudioContext();

// Thanx to https://stackoverflow.com/questions/25654558/html5-js-play-same-sound-multiple-times-at-the-same-time/76916935#76916935?newreg=0c69169e05424502b2da5acc98455370
class Sound {
    url = '';
    buffer = null;
    sources = [];

    constructor(url) {
        this.url = url;
    }

    load() {
        if (!this.url) return Promise.reject(new Error('Missing or invalid URL: ', this.url));

        if (this.buffer) return Promise.resolve(this.buffer);

        return new Promise((resolve, reject) => {
            const request = new XMLHttpRequest();

            request.open('GET', this.url, true);
            request.responseType = 'arraybuffer';

            // Decode asynchronously:

            request.onload = () => {
                context.decodeAudioData(request.response, (buffer) => {
                    if (!buffer) {
                        console.log(`Sound decoding error: ${ this.url }`);

                        reject(new Error(`Sound decoding error: ${ this.url }`));

                        return;
                    }

                    this.buffer = buffer;

                    resolve(buffer);
                });
            };

            request.onerror = (err) => {
                console.log('Sound XMLHttpRequest error:', err);

                reject(err);
            };

            request.send();
        });
    }

    play(volume = 1, time = 0) {
        if (!this.buffer) return;

        // Create a new sound source and assign it the loaded sound's buffer:

        const source = context.createBufferSource();

        source.buffer = this.buffer;

        // Keep track of all sources created, and stop tracking them once they finish playing:

        this.sources.push(source);

        source.onended = () => {
            source.stop(0);

            const idx = Array.prototype.indexOf.call(this.sources, source)
            this.sources.splice(idx, 1);
        };

        // Create a gain node with the desired volume:

        const gainNode = context.createGain();

        gainNode.gain.value = volume;

        // Connect nodes:

        source.connect(gainNode).connect(context.destination);

        // Start playing at the desired time:

        source.start(time);
    }

    stop() {
        // Stop any sources still playing:

        this.sources.forEach((source) => {
            source.stop(0);
        });

        this.sources = [];
    }

}

export { Sound }
