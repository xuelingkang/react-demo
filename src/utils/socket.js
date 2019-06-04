import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

const sockets = {};

export default class Socket {
    url;
    interval;
    headers;
    callback;
    debug;
    /**
     * @param {string} url
     * @param {number} [interval]
     * @param {object} [headers]
     * @param {function} callback
     * @param {boolean} [debug]
     */
    constructor({url, interval=5000, headers={}, callback, debug}) {
        if (!url || typeof url!=='string' || !callback || typeof callback!=='function') {
            throw new Error('参数错误');
        }
        this.url = url;
        this.interval = interval;
        this.headers = headers;
        this.callback = callback;
        this.debug = debug;
    }
    connect() {
        sockets[this.url] = {};
        const socket = new SockJS(this.url);
        const client = Stomp.over(socket);
        sockets[this.url]['client'] = client;
        if (!this.debug) {
            client.debug = null;
        }
        client.connect(
            this.headers,
            frame => (typeof this.callback==='function' && this.callback({client, frame})),
            () => {
                sockets[this.url]['timer'] = setTimeout(() => this.connect({
                    url: this.url,
                    interval: this.interval,
                    headers: this.headers,
                    callback: this.callback,
                    debug: this.debug
                }), this.interval);
            });
    }
}

export const disconnect = key => {
    if (key) {
        const {client, timer} = sockets[key];
        if (client) {
            client.disconnect();
        }
        if (timer) {
            clearTimeout(timer);
        }
        sockets[key] = null;
    } else {
        for (const name in sockets) {
            if (sockets.hasOwnProperty(name)) {
                disconnect(name);
            }
        }
    }
}
