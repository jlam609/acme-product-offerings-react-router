const path = require('path')

module.exports = {
    entry: path.join(__dirname, './src/index.js'),
    mode:'development',
    devtool:'source-map',
    watch:true,
    module: {
        rules:[
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                  loader: 'babel-loader',
            }
        }
        ],
        },
    }