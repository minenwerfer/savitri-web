#!/usr/bin/env node

import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import makeConfig from './make-config'

declare namespace global {
  let appDir: string
}

const relpath = 'build'
const mode = process.argv[2];

(() => {
  try {
    const content = (() => {
      {
        try {
          return require(`${process.cwd()}/${relpath}`)
        } catch( e ) {
          return {}
        }
      }
    })()

    const buildConfig = Object.assign(content, {
      mode,
      name: process.cwd().split('/').pop(),
    })

    global.appDir = process.cwd()
    process.chdir(__dirname)

    const config = makeConfig(buildConfig)
    const compiler = webpack(config)

    if( ['production', 'lib'].includes(mode) ) {
      compiler.run((err: any, stats: any) => console.log((err || stats).toString()))
      return
    }

    const options = {
      hot: false,
      client: false,
      compress: true,
      allowedHosts: 'all',
      historyApiFallback: {
        index: '/'
      }
    }

    const server = new WebpackDevServer(options, compiler)
    server.startCallback(() => console.log('Listening'))

  } catch(error) {
    // webpack drops a thousand lines of error
    console.trace(error)
  }
})()
