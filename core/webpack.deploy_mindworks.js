const { merge } = require('webpack-merge');
const common = require('../webpack.common.js');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const config = require('../playable/build-settings.json');
const ZipPlugin = require('zip-webpack-plugin');

module.exports = merge(common, {
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: './public/mindworks.html',
            filename: './' + config.name + '.html',
            title: config.name,
            inlineSource: '.(js|css|png|jpg|svg|mp3|gif|glb|fbx)$',
        }),
        new ZipPlugin({
            filename:
                './' + config.prefix + '-' + config.date + '-' + config.name + '-' + config.language + '-MINDWORKS',
            path: '../',
        }),
    ],

    mode: 'production',
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, '../dist/mindworks'),
    },
});
