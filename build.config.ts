import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  failOnWarn: false,
  externals: [
    '@nuxt/kit',
    '@nuxt/schema',
    '@owdproject/core',
    '@owdproject/module-nuxt-fs',
    'vue3-selecto',
    '@nuxt/ui',
    'vue',
    'nuxt',
    'nuxt/app',
  ],
})
