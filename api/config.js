const minimist = require('minimist');

function maybeParseInt(s) {
    try {
        return parseInt(s, 10);
    } catch (err) {
        return s;
    }
}

function fullEnvName(base) {
    return "OAPDAPI_" + base;
}

class GoogleConfig {
    constructor(clientID, clientSecret) {
        this.clientID = clientID;
        this.clientSecret = clientSecret;
    }

    strategyConfig(callbackURL) {
        return {
            clientID: this.clientID,
            clientSecret: this.clientSecret,
            callbackURL: callbackURL,
        };
    }
}

class Config {
    constructor() {
        this.args = minimist(process.argv.slice(2));
        this.version = "0.1.0";
        this.google = new GoogleConfig(
            '519279452507-b5g2d0unnkka2uq50tgqrn48jtq1c6gh.apps.googleusercontent.com',
            'D1sW6cq2WzORTxQed-OBZsud' // TODO: remove from code 
        );
    }

    getArgS(argName, envNameBase, defaultValue) {
        const envName = fullEnvName(envNameBase);
        if (this.args[argName] != undefined) {
            return this.args[argName];
        } else if (process.env[envName] != undefined) {
            return process.env[envName];
        } else if (defaultValue != undefined) {
            return defaultValue;
        } else {
            return undefined;
        }
    }

    getArgI(argName, envNameBase, defaultValue) {
        const envName = fullEnvName(envNameBase);
        if (this.args[argName] != undefined) {
            return this.args[argName];
        } else if (process.env[envName] != undefined) {
            return maybeParseInt(process.env[envName]);
        } else if (defaultValue != undefined) {
            return defaultValue;
        } else {
            return undefined;
        }
    }

    get bindPort() {
        return this.getArgI("bind-port", "BIND_PORT", 8080);
    }

    get dbUrl() {
        return this.getArgS("db-url", "DB_URL");
    }
}

module.exports = new Config();
