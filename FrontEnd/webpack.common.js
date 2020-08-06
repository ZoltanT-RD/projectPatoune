const path = require("path");
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); //this is used to focefully delete the output folder before every build
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); //this is to create indiidual css files
const Dotenv = require('dotenv-webpack');

module.exports = {
    entry: {
        mainz: path.resolve(__dirname, 'src/index-routed.js') //'./index-routed.js' //where to start building the tree (using `import/export`); node 0
        //login: "./src/login.js" //to add aditional bundles
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
        new MiniCssExtractPlugin({ filename: '[name].[contentHash].css' }), //create actual css files
        new Dotenv({
            path: '../.env', // load this now instead of the ones in '.env'
            safe: false, // load '.env.example' to verify the '.env' variables are all set. Can also be a string to a different file.
            allowEmptyValues: true, // allow empty variables (e.g. `FOO=`) (treat it as empty string, rather than missing)
            systemvars: true, // load all the predefined 'process.env' variables which will trump anything local per dotenv specs.
            silent: false, // hide any errors
            defaults: false // load '.env.defaults' as the default values if empty.
        })
    ]
}