import { defineNuxtPlugin } from 'nuxt/app'
import { DESKTOP_DIALOG_PROVIDER_KEY } from '@owdproject/nuxt/runtime/constants/desktopShellKeys'
import { createDesktopDialogs } from '../dialogs/createDesktopDialogs'

export default defineNuxtPlugin({
  name: 'owd-kit-nuxt-ui-dialogs',
  enforce: 'pre',
  setup(nuxtApp) {
    nuxtApp.vueApp.provide(
      DESKTOP_DIALOG_PROVIDER_KEY,
      createDesktopDialogs(),
    )
  },
})
