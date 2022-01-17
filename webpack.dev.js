const path = require('path');
const common = require("./webpack.config");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const {merge} = require("webpack-merge");

module.exports = merge(common, {
    devServer: {
        server: {
            type: 'https',
        },
        host: "www.local.docui.com",
        port: 7001,
        compress: true,
        proxy: {
            "/api": "http://localhost:7000"
        },
    },
    mode: "development",
    output: {
        filename: "[name].[bundle].js",
        path: path.resolve(__dirname, "dev")
    },
    plugins: [
    ],
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: ["style-loader", "css-loader", "sass-loader"],
            },
        ]
    }
});
