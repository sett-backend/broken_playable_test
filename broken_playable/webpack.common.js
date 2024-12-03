const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
        index: path.join(__dirname, '/playable/index.ts'),
    },
    stats: 'errors-only',
    module: getLoaders(),
    resolve: {
        extensions: ['.ts', '.js', '.json', '.png', '.glb', '.jpg', '.mp3', '.svg', '.css', '.gif', '.mp4'],
        alias: {
            helper: path.resolve(__dirname, './helper'),
            assets: path.resolve(__dirname, './assets'),
            core: path.resolve(__dirname, './core'),
            components: path.resolve(__dirname, './components'),
            playable: path.resolve(__dirname, './playable'),
            root: path.resolve(__dirname, ''),
        },
    },
    plugins: [
        new webpack.ProvidePlugin({
            React: 'react',
        }),
        new webpack.ProvidePlugin({ 'window.decomp': 'poly-decomp' }),
    ],
    output: {
        publicPath: '',
        path: path.resolve(__dirname, '../dist'),
    },
};

/**
 * Loaders used by the application.
 */
function getLoaders() {
    const esbuild = {
        test: /\.ts?$/,
        loader: 'esbuild-loader',
        options: {
            loader: 'tsx',
            target: 'es2015',
        },
        exclude: /node_modules/,
    };
    const fileLoader = [
        {
            test: /\.(png|jpg|svg|glb|mp3|gif)$/,
            loader: 'url-loader',
        },
    ];
    //remove css
    const cssLoader = {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
    };

    const loaders = {
        rules: [...fileLoader, cssLoader, esbuild],
    };

    return loaders;
}
