import { merge } from 'webpack-merge'
// const { readFileSync } = require('fs')

const oldCwd = process.cwd()

export default (params: any) => {
  // dev, prod or lib
  const modes: Record<string, string> = {
    production: 'prod',
    development: 'dev'
  }

  const { webpackConfig } = require(`./webpack.config.${modes[params.mode]||'dev'}`)

  params.externals ??= {}
  params.externals.variables ??= {}

  Object.assign(params.externals.variables, {
    workingDir: oldCwd,
    bundleName: params.name,
    productVersion: require(`${oldCwd}/package.json`).version,
  })

  const config = merge(webpackConfig, {
    ...params,
    externals: Object.entries(params.externals||{})
      .reduce((a, [key, value]) => ({ ...a, [key]: JSON.stringify(value) }), {}),

   // resolve: {
   //    alias: {
   //      'variables': `${oldCwd}/build.json`
   //    },
   //  },

    output: params.mode === 'production'
      ? { path: `/var/www/html/${params.name}` }
      : {}
  })

  if( params.tsTranspileOnly ) {
    delete config.tsTranspileOnly
    config.module.rules = config.module.rules
      .map((r: any) => r.loader !== 'ts-loader' ? r : {
        ...r,
        options: {
          ...r.options,
          transpileOnly: true
        }
      })
  }

  return config
}
