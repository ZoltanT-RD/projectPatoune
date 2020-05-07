const path = require("path");
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); //this is used to focefully delete the output folder before every build
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); //this is to create indiidual css files

module.exports = {
    entry: {
        mainz: path.resolve(__dirname, 'src/index-routed.js')//'./index-routed.js' //where to start building the tree (using `import/export`); node 0
        //vendor: "./src/vendor.js" //to add aditional bundles
    },
    module: {

        rules: [
            {   //use babel to convert ES6 and jsx to ES2015
                test: /\.(js|jsx)$/,
                exclude: /node-modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.scss$/,
                use: [  //the order is IMPORTANT here

                    MiniCssExtractPlugin.loader, //creates a proper css file
                    'css-loader', // Translates CSS into CommonJS
                    'sass-loader' // Compiles Sass to CSS
                ]
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader"
                ]
            },
            {
                test: /\.html$/,
                use: ["html-loader"]
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: {
                    loader: "file-loader",
                    options: {
                        name: "[name].[hash].[ext]",
                        outputPath: "img",
                        esModule: false
                    }
                }
            },
            {
                test: /\.svg$/,
                use: [
                    {
                        loader: "babel-loader"
                    },
                    {
                        loader: "react-svg-loader",
                        options: {
                            jsx: true // true outputs JSX tags
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(), //delete output folder before build
        new MiniCssExtractPlugin({ filename: '[name].[contentHash].css' }) //create actual css files
    ]
}