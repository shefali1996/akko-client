/**
 * Default dev server configuration
 */
const webpack = require('webpack');
const WebpackBaseConfig = require('./Base');
const CompressionPlugin = require('compression-webpack-plugin');

class WebpackDevConfig extends WebpackBaseConfig {
  constructor() {
    super();
    this.config = {
      devtool: 'cheap-module-source-map',
      entry:   [
        'webpack-dev-server/client?http://localhost:3000/',
        'webpack/hot/only-dev-server',
        'react-hot-loader/patch',
        'babel-polyfill',
        './index.js',
      ],
    };

    this.config.plugins = this.config.plugins.concat([
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
      new CompressionPlugin({
        test: /\.js(\?.*)?$/i
      })
    ]);

    this.config.module.rules = this.config.module.rules.concat([
      {
        test:    /\.scss$/,
        use: [
          { loader: 'style-loader' },
          {
            loader:  'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader:  'sass-loader',
            options: {
              sourceMap: true,
            },
          },
          
        ],
      },
      {
        test:    /^.((?!cssmodule).)*\.less$/,
        use: [
          { loader: 'style-loader' },
          {
            loader:  'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader:  'less-loader',
            options: {
              sourceMap: true,
            },
          },
          
        ],
      },
    ]);
  }
}

module.exports = WebpackDevConfig;
