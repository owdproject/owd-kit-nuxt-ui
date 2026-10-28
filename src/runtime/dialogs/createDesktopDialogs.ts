import { useModal } from '#imports'
import NuxtUIConfirmModal from '../components/dialogs/NuxtUIConfirmModal.vue'
import NuxtUIAlertModal from '../components/dialogs/NuxtUIAlertModal.vue'
import type {
  DesktopConfirmDialogOptions,
  DesktopDialogProvider,
} from '@owdproject/nuxt/runtime/dialogs/desktopDialogProvider'

export function createDesktopDialogs(): DesktopDialogProvider {
  return {
    confirm(opts: DesktopConfirmDialogOptions): Promise<boolean> {
      return new Promise((resolve) => {
        const modal = useModal()
        const toTrash = opts.extras?.toTrash

        modal.open(NuxtUIConfirmModal, {
          title: opts.title ?? 'Confirm',
          message: typeof opts.message === 'string' ? opts.message : opts.message?.message ?? '',
          acceptLabel: opts.acceptLabel ?? 'OK',
          rejectLabel: opts.rejectLabel ?? 'Cancel',
          toTrash: !!toTrash,
          onSuccess: () => {
            modal.close()
            resolve(true)
          },
          onCancel: () => {
            modal.close()
            resolve(false)
          }
        })
      })
    },
    alert(message: string, options?: { title?: string }): Promise<void> {
      return new Promise((resolve) => {
        const modal = useModal()
        modal.open(NuxtUIAlertModal, {
          title: options?.title ?? 'Alert',
          message,
          onSuccess: () => {
            modal.close()
            resolve()
          }
        })
      })
    },
    prompt(message: string, defaultValue = '') {
      if (import.meta.server) return Promise.resolve(null)
      const g = globalThis as typeof globalThis & {
        prompt?: (m?: string, d?: string) => string | null
      }
      const v =
        typeof g.prompt === 'function' ? g.prompt(message, defaultValue) : null
      return Promise.resolve(v === null ? null : v)
    },
  }
}
