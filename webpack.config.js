const path = require('path');
const WebpackCopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build'),
    clean: true
  },
  devtool: 'source-map',
  plugins: [
    new WebpackCopyPlugin({
      patterns: [{ from: 'public' }]
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["babel-loader"],
        exclude: /(node_modules)/
      }
    ]
  }
};
