const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
   entry: './src/index/index.js',
   output: {
      filename: 'main.js',
      path: path.resolve(__dirname, 'build'),
   },
   plugins: [new HtmlWebpackPlugin(
       {
        template: path.resolve(__dirname, 'public/index.html'),
        filename: 'index.html'
       }
   )],
   
 module:{
    rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: 'style-loader',
            },
            {
              loader: 'css-loader',
            },
          ],
        },
      ],
 },
 target: "electron-renderer"
};