const path = require('path');

module.exports = {
    entry: '../ui/index.ts',
    resolve: {
        root: [
            __dirname,
            path.resolve(__dirname, 'node_modules')
        ],
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'app.bundle.js',
    },
    resolve: {
        extensions: [ ".ts", ".tsx", ".js" ],
        modules: [
            __dirname,
            path.resolve(__dirname, 'node_modules')
        ],
    },
    module: {
        rules: [
            { test: /\.json$/, use: 'json-loader' },
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            configFile: 'tsconfig.json'
                        },
                    }
                ]
            },
        ],
    },
};
