const http = require('http');
const https = require('https');

class HttpResponse {
    constructor(res) {
        this.res = res;
        // TODO: hint this allocation with content-length header
        this.body = new Buffer([]);
    }

    get statusCode() {
        return this.res.statusCode;
    }

    isSuccess() {
        return (this.statusCode >= 200 && this.statusCode < 300);
    }

    checkResponse() {
        return new Promise((fulfill, reject) => {
            if (this.isSuccess()) {
                fulfill(this);
            } else {
                reject(new Error(`HTTP error code (${this.statusCode}): ${this.body}`));
            }
        });
    }

    updateBody(chunk) {
        this.body = Buffer.concat([this.body, chunk]);
    }
}

function httpRequestF(options, reqBody) {
    if (reqBody) {
        if (!options['headers']) {
            options.headers = {};
        }
        if (!options.headers['Content-Length']) {
            options.headers['Content-Length'] = Buffer.byteLength(reqBody);
        }
    }
    const httpM = (options.protocol == "https:") ? https : http;
    return new Promise(function (resolve, reject) {
        const req = httpM.request(options, function (res) {
            res = new HttpResponse(res);
            res.res.on('data', (chunk) => res.updateBody(chunk));
            res.res.on('end', () => resolve(res));
        });
        req.on('error', reject);
        req.write(reqBody);
        req.end();
    });
}

exports.HttpResponse = HttpResponse;
exports.httpRequestF = httpRequestF;
