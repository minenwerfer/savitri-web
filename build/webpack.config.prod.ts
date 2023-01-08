const path = require('path')
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { merge } from 'webpack-merge'
import { baseWebpackConfig } from './webpack.config.base'

// production
export const webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  devtool: 'eval-source-map',

  output: {
    filename: '[name].bundle.js',
    path: `/var/www/html`
  },

  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(__dirname, '../public/index.html')
    }),
  ]
} as any)
