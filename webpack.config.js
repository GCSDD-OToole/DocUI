const path = require('path');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    context: path.resolve(__dirname, "src/ui"),
    entry: {
        index: "./index.js",
        settings: "./settings.js",
    },
    output: {
        publicPath: "/",
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.tmpl$/,
                use: ["raw-loader"],
            },
            {
                test: /\.html$/,
                use: ["html-loader"],
            },
            {
                test: /\.(svg|png|jpg|gif)$/,
                use: {
                    loader: "file-loader",
                    options: {
                        name: "[name].[hash].[ext]",
                        outputPath: "imgs",
                    }
                }
            },
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: "./index.html",
            inject: true,
            chunks: ['index'],
            filename: "index.html",
        }),
        new HtmlWebpackPlugin({
            template: "./settings.html",
            inject: true,
            chunks: ['settings'],
            filename: "settings/index.html",
        }),
    ],
}
