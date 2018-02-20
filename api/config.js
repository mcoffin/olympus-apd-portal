const minimist = require('minimist');
const mysql = require('mysql');

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

function appendArgs(a) {
    return Array.prototype.slice.call(a, 0).concat(Array.prototype.slice.call(arguments, 1));
}

function promisify(f, ctx) {
    return function () {
        let args = arguments;
        return new Promise((fulfill, reject) => {
            args = appendArgs(args, function (err, v) {
                if (err) {
                    reject(err);
                } else {
                    fulfill(v);
                }
            });
            f.apply(ctx, args);
        });
    };
}

class DBConfig {
    constructor(options) {
        this.connection = mysql.createConnection(options);
        this.connection.connect();

        this.query = promisify(this.connection.query, this.connection);
        this.beginTransaction = promisify(this.connection.beginTransaction, this.connection);
        this.commit = promisify(this.connection.commit, this.connection);
        this.rollback = promisify(this.connection.rollback, this.connection);
    }

    close() {
        this.connection.end();
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

    get dbConfig() {
        if (!this._dbConfig) {
            this._dbConfig = new DBConfig(this.dbOptions);
        }
        return this._dbConfig;
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

    get sessionSecret() {
        return this.getArgS("session-secret", "SESSION_SECRET", "foo");
    }

    get bindPort() {
        return this.getArgI("bind-port", "BIND_PORT", 8080);
    }

    get dbHost() {
        return this.getArgS("db-host", 'DB_HOST', "localhost");
    }

    get dbUser() {
        return this.getArgS("db-user", 'DB_USER', "root");
    }

    get dbPassword() {
        return this.getArgS("db-password", 'DB_PASSWORD', '');
    }

    get dbDatabase() {
        return this.getArgS('db-database', 'DB_DATABASE', 'apd_db');
    }

    get dbOptions() {
        return {
            host: this.dbHost,
            user: this.dbUser,
            password: this.dbPassword,
            database: this.dbDatabase,
        };
    }
}

module.exports = new Config();
