const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: {
        'index': './src/index.js',
        '../lib/ticker': './src/lib/ticker-expose.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].min.js'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                include: path.resolve(__dirname, 'src'),
                exclude: /node_modules/
            },
            {
                test: path.resolve(__dirname, 'src/lib/ticker-expose.js'),
                use: 'expose-loader?Ticker'
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HTMLWebpackPlugin({
            template: path.resolve(__dirname, 'public/index.html'),
            title: 'Ticker测试',
            hash: true,
            chunks: ['index']
        }),
        new HTMLWebpackPlugin({
            inject: "head",
            filename: 'index-lib.html',
            template: path.resolve(__dirname, 'public/index-lib.html'),
            title: 'TickerLib测试',
            hash: true,
            chunks: ['../lib/ticker']
        })
    ],
    resolve: {
        extensions: ['.js', '.ts']
    },
    devServer: {
        host: '0.0.0.0',
        port: 8000,
        inline: true
    }
};