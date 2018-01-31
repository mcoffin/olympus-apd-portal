const path = require('path');
const webpack = require('webpack');

class SimpleRule {
    constructor(test) {
        if (arguments.length < 1) {
            return;
        }
        this.test = test;
        this.use = [];
        const loaders = Array.prototype.slice.call(arguments, 1);
        loaders.forEach(loader => this.use.push(loader));
    }
}

module.exports = {
    entry: {
        app: './ui/app.ts',
        vendor: './ui/vendor.ts',
        polyfill: './ui/polyfill.ts',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/dist/',
        filename: '[name].bundle.js',
    },
    resolve: {
        extensions: [ '.ts', '.js' ],
    },
    module: {
        rules: [
            new SimpleRule(/\.ts$/, { loader: 'awesome-typescript-loader' }),
            { test: /\.css$/, loaders: 'style-loader!css-loader' },
            {
                test: /\.scss$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' },
                    { loader: 'sass-loader' },
                ],
            },
            new SimpleRule(/\.json$/, { loader: 'json-loader' }),
        ],
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: ['app', 'vendor', 'polyfill'],
            minChunks: Infinity,
        }),
    ],
};
