import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

export default class Socket {
    url;
    interval;
    headers;
    callback;
    debug;
    static client;
    static timerId;
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
        const socket = new SockJS(this.url);
        Socket.client = Stomp.over(socket);
        if (!this.debug) {
            Socket.client.debug = null;
        }
        Socket.client.connect(
            this.headers,
            frame => (typeof this.callback==='function' && this.callback({client: Socket.client, frame})),
            () => {
                if (Socket.timerId) {
                    clearTimeout(Socket.timerId);
                }
                Socket.timerId = setTimeout(() => this.connect({
                    url: this.url,
                    interval: this.interval,
                    headers: this.headers,
                    callback: this.callback,
                    debug: this.debug
                }), this.interval);
            });
    }
    static disconnect = () => {
        if (Socket.client) {
            Socket.client.disconnect();
            Socket.client = null;
        }
        if (Socket.timerId) {
            clearTimeout(Socket.timerId);
            Socket.timerId = null;
        }
    }
}
