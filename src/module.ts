import {
  defineNuxtModule,
  createResolver,
  addComponentsDir,
  addPlugin,
  installModule,
} from '@nuxt/kit'
import { defu } from 'defu'
import type { Nuxt } from '@nuxt/schema'
import { registerTailwindPath } from './kit/registerTailwindPath'

export interface KitNuxtUiModuleOptions {
  /**
   * Register `DesktopExplorer*` components (Workspace, FileEntry, …).
   * Requires `@owdproject/module-fs` in the app when enabled (default).
   * Set `false` for Nuxt UI + dialogs only.
   */
  explorer?: boolean
}

function flattenTailwindContentPaths(content: unknown): string[] {
  const paths: string[] = []

  if (typeof content === 'string') {
    paths.push(content)
    return paths
  }

  if (Array.isArray(content)) {
    for (const entry of content) {
      paths.push(...flattenTailwindContentPaths(entry))
    }
    return paths
  }

  if (content && typeof content === 'object') {
    const record = content as Record<string, unknown>
    if (Array.isArray(record.files)) {
      for (const entry of record.files) {
        if (typeof entry === 'string') paths.push(entry)
      }
    }
    for (const [key, value] of Object.entries(record)) {
      if (key === 'files') continue
      paths.push(...flattenTailwindContentPaths(value))
    }
  }

  return paths
}

function mergeDesktopTailwindContent(
  nuxt: Nuxt,
  config: { content?: unknown; plugins?: unknown[]; darkMode?: unknown },
) {
  const registered = [...(nuxt.options.desktopTailwindContent ?? [])]
  const prior = flattenTailwindContentPaths(config.content)
  const merged = [...new Set([...prior, ...registered])]

  if (merged.length > 0) {
    config.content = { files: merged }
  }

  if (nuxt.options.dev && merged.length > 0) {
    console.info(
      '[desktop-kit-nuxt-ui] Tailwind content:',
      merged.length,
      'paths',
    )
  }
}

export default defineNuxtModule<KitNuxtUiModuleOptions>({
  meta: {
    name: 'desktop-kit-nuxt-ui',
    configKey: 'kitNuxtUi',
  },
  defaults: {
    explorer: true,
  },
  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    // Setup Tailwind configuration hook before installing Nuxt UI module
    nuxt.hook('tailwindcss:config', (config) => {
      mergeDesktopTailwindContent(nuxt, config)
    })

    // Install Nuxt UI (which includes TailwindCSS module and icon module internally)
    await installModule('@nuxt/ui', {
      global: true
    })

    addPlugin({
      src: resolve('./runtime/plugins/01.desktop-nuxt-ui-dialogs.client'),
      mode: 'client',
      order: 1,
    })

    if (options.explorer !== false) {
      addComponentsDir({
        path: resolve('./runtime/components/explorer'),
        prefix: 'DesktopExplorer',
        pathPrefix: false,
      })

      registerTailwindPath(
        nuxt,
        resolve('./runtime/components/explorer/**/*.{vue,mjs,ts}'),
      )
    }
  },
})
