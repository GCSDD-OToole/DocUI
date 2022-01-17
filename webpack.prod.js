const path = require('path');
const common = require("./webpack.config");
const {merge} = require("webpack-merge");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin").default;
const CssMinimizer = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = merge(common, {
    mode: "production",
    output: {
        filename: "[name].[contenthash].bundle.js",
        path: path.resolve(__dirname, "dist/ui")
    },
    optimization: {
        minimizer: [ new CssMinimizer(), new TerserPlugin() ],
    },
    plugins: [
        new MiniCssExtractPlugin({filename: "[name].[contenthash].css"}),
    ],
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "sass-loader",
                ],
            },
        ]
    },
});
