const path = require("path");
const common = require("./webpack.common");
const merge = require("webpack-merge");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
var HtmlWebpackPlugin = require("html-webpack-plugin");

///fixme thes build config is not working for some reason...

module.exports = merge(common, {
    mode: "production",
    output: {
        filename: "[name].[contentHash].js",
        path: path.resolve(__dirname, "dist")
    },
    optimization: {
        minimizer: [
            new OptimizeCssAssetsPlugin(), //to minimise CSS

            //the ones below were enabled by default, but coz' defining minimizer array here, it has to be re-introduced
            new TerserPlugin(), //to minimise JS
            new HtmlWebpackPlugin({ //minimise/clean htmls
                template: "./src/index-template.html",
                minify: {
                    removeAttributeQuotes: true,
                    collapseWhitespace: true,
                    removeComments: true,
                    removeRedundantAttributes: true,
                    caseSensitive: true,
                    collapseBooleanAttributes: true,
                    keepClosingSlash: true,
                    removeEmptyAttributes: true,
                    removeEmptyElements: true,
                    sortAttributes: true,
                    sortClassName: true

                    //https://github.com/DanielRuf/html-minifier-terser#options-quick-reference
                    //http://perfectionkills.com/experimenting-with-html-minifier/
                }
            })
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/htmlTemplate.html',
            chunks: ['mainz']
        }),
        new HtmlWebpackPlugin({
            filename: 'login.html',
            template: './src/htmlTemplate.html',
            chunks: ['login']
        })
    ]
});