const path = require('path');
const NodemonPlugin = require('nodemon-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './src/items.js',
    devtool: 'source-map',
    output: {
        filename: 'items.js',
        path: path.resolve(__dirname, 'public'),
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: { presets: ['@babel/preset-env'] },
                }
            }
        ],
    },
    plugins: [
        new NodemonPlugin()
    ],
};
