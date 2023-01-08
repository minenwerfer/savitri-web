import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { merge } from 'webpack-merge'
import { baseWebpackConfig } from './webpack.config.base'

// development
export const webpackConfig = merge(baseWebpackConfig, {
  mode: 'development',

  entry: [
    'webpack/hot/dev-server.js',
    'webpack-dev-server/client/index.js?hot=true&live-reload=true',
    `${(global as any).appDir}`
  ],

  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
    }),
    new webpack.HotModuleReplacementPlugin()
  ],

} as any)
