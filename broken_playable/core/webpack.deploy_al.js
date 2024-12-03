const { merge } = require('webpack-merge');
const common = require('../webpack.common.js');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlInlineScriptPlugin = require('html-inline-script-webpack-plugin');
const config = require('../playable/build-settings.json');

module.exports = merge(common, {
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: './public/appLovin.html',
            filename: './' + config.prefix + '-' + config.date + '-' + config.name + '-' + config.language + '-AL.html',
            title: config.name,
            inlineSource: '.(js|css|png|jpg|svg|mp3|gif)$',
        }),
        new HtmlInlineScriptPlugin(),
    ],
    mode: 'production',
    output: {
        publicPath: '',
        path: path.resolve(__dirname, '../dist'),
    },
});
