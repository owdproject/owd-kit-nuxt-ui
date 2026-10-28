<script setup lang="ts">
import { inject, useSlots, computed } from "vue"
import { useToggleWindowMaximize } from "nuxt-desktop/runtime/composables/useToggleWindowMaximize"

const windowController = inject<any>("windowController")
const toggleWindowMaximize = useToggleWindowMaximize()
const slots = useSlots()
const hasCustomTitle = computed(() => typeof slots.title === "function")

function onWindowMinimize() {
  if (!windowController?.instanced) return
  windowController.actions.minimize()
}

function onWindowMaximize() {
  toggleWindowMaximize(windowController)
}

function onWindowNavDestroy() {
  if (!windowController?.instanced) return
  windowController.actions.destroy()
}
</script>

<template>
  <DesktopCoreWindowNav 
    class="flex items-center justify-between px-3 py-1.5 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 select-none cursor-default"
    @dblclick="onWindowMaximize"
  >
    <div class="flex items-center space-x-2 min-w-0">
      <slot name="prepend" />

      <slot v-if="hasCustomTitle" name="title" />

      <template v-else>
        <UIcon
          v-if="windowController?.icon"
          :name="windowController.icon"
          class="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0"
        />

        <span 
          v-if="windowController?.title" 
          class="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate"
          v-text="windowController?.title"
        />
      </template>
    </div>

    <div class="flex items-center space-x-1 flex-shrink-0">
      <slot name="append" />

      <UButton
        v-if="!windowController?.instanced || windowController?.isMinimizable"
        icon="i-heroicons-minus"
        size="2xs"
        color="gray"
        variant="ghost"
        class="h-5 w-5 p-0 flex items-center justify-center rounded"
        @mousedown.stop
        @click.stop="onWindowMinimize"
      />
      <UButton
        v-slot:default
        v-if="windowController?.isMaximizable"
        icon="i-heroicons-squares-2x2"
        size="2xs"
        color="gray"
        variant="ghost"
        class="h-5 w-5 p-0 flex items-center justify-center rounded"
        @mousedown.stop
        @click.stop="onWindowMaximize"
      />
      <UButton
        v-slot:default
        v-if="!windowController?.instanced || windowController?.isDestroyable"
        icon="i-heroicons-x-mark"
        size="2xs"
        color="red"
        variant="ghost"
        class="h-5 w-5 p-0 flex items-center justify-center rounded hover:bg-red-500 hover:text-white"
        @mousedown.stop
        @click.stop="onWindowNavDestroy"
      />
    </div>
  </DesktopCoreWindowNav>
</template>
