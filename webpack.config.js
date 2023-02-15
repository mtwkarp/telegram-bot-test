const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    mode: 'production',
    target: 'node',
    entry: {
        index: './src/index.ts',
    },
    externals: [nodeExternals()], // removes node_modules from your final bundle
    module: {
     rules: [
         {
             test: /\.ts$/,
             exclude: /node_modules/,
             loader: 'ts-loader',
             options: {
                 transpileOnly: true
             }
         }
     ]
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'build'),
        clean: true,
    },
    resolve: {
        extensions: [ '.ts', '.js', 'json']
    },
};