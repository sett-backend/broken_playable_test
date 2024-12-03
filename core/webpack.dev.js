const { merge } = require('webpack-merge');
const common = require('../webpack.common.js');
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
      allowedHosts: [
    'host.docker.internal',
  ],
        hot: true,
        historyApiFallback: true,
        port: 3000,
    },
    plugins: [
        new ESLintPlugin({
            emitError: true,
            emitWarning: true,
        }),
        new HtmlWebpackPlugin({
            template: './public/index.html',
            filename: './index.html',
            title: 'playable dev',
            inlineSource: '.(js|css|png|jpg|glb|mp3|gif|mp4)$',
        }),
    ],

    output: {
        filename: '[name].js',
    },
});
