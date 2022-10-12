const path = require("path");

const {CleanWebpackPlugin} = require("clean-webpack-plugin");

module.exports = {
    entry: './index.js',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'main.js'
    },

    module: {
        rules:[
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader",
                        options: { minimize : false }
                    }
                ]
            },
            {
                test: /\.(png|jpg|svg|gif)$/,
                use: [
                    {
                        loader: "file-loader",
                    }
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
    ]
}
