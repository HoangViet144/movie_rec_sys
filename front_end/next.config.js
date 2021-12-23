const variables = {
  BASE_URL: ``,
  BASE_API_URL: 'https://movie-rec-sys-hcmut1.herokuapp.com/api',
}

const additionalVariables = {
  SHOPEE_URL: 'https://uat.shopee.vn',
  APP_NAME: 'AnimeN',
}

const moduleExports = {
  env: {
    ...variables,
    ...additionalVariables,
    DEBUG: process.env.DEBUG && process.env.DEBUG === 'true',
    OPTIMIZE_IMAGE: true,
  },
  exportPathMap: async function (defaultPathMap, { dev, dir, outDir, distDir, buildId }) {
    return defaultPathMap
  },
  // assetPrefix: customENV !== 'dev' ? process.env.STATIC_URL : '',
  trailingSlash: true,
  reactStrictMode: true,
  images: {
    domains: ['links.papareact.com', 'image.tmdb.org', 'cdn.myanimelist.net'],
  },

  // webpack(config) {
  //   const rules = config.module.rules
  //     .find((rule) => typeof rule.oneOf === 'object')
  //     .oneOf.filter((rule) => Array.isArray(rule.use))

  //   rules.forEach((rule) => {
  //     rule.use.forEach((moduleLoader) => {
  //       if (moduleLoader.loader.includes('resolve-url-loader')) moduleLoader.options.sourceMap = false
  //     })
  //   })

  //   return config
  // },
}

module.exports = moduleExports

// module.exports = moduleExports
