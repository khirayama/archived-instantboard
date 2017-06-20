const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/client.tsx',
  output: {
    path: path.resolve(__dirname, 'dist', 'public'),
    filename: 'bundle.js'
  },
  resolve: {
    modules: [
      path.join(__dirname, "src"),
      "node_modules",
    ],
    extensions: [".ts", ".tsx", ".js", ".json"],
  },
  module: {
    rules: [{
      test: [/\.ts?$/, /\.tsx?$/],
      loader: 'ts-loader?' + JSON.stringify({
        configFileName: './tsconfig.client.json',
      }),
    }],
  },
  devtool: 'inline-source-map',
};
