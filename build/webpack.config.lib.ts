const path = require('path')
import { merge } from 'webpack-merge'
import { baseWebpackConfig } from './webpack.config.base'

// library
export const webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  entry: {
    index: path.resolve(__dirname, '../../../packages/components/index.ts'),
  },
  output: {
    path: path.resolve(__dirname, '../../../dist/components'),
    filename: '[name].js',
    libraryExport: 'default',
    libraryTarget: 'commonjs2'
  },
  optimization: {
    splitChunks: false
  }
} as any)
