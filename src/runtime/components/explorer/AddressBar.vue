<script setup lang="ts">
import { ref, watch } from 'vue'
import {
  formatExplorerDisplayPath,
  parseExplorerVfsPath,
} from '@owdproject/module-fs/runtime/utils/utilExplorerDisplayPath'

const props = defineProps({
  address: { type: String, required: true },
})

const emit = defineEmits(['update:modelValue'])

const addressInput = ref(formatExplorerDisplayPath(props.address))

watch(
  () => props.address,
  (address) => {
    addressInput.value = formatExplorerDisplayPath(address)
  },
)

function onEnter() {
  emit('update:modelValue', parseExplorerVfsPath(addressInput.value))
}
</script>

<template>
  <div class="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
    <span class="text-xs font-semibold text-gray-500 dark:text-gray-400 select-none">
      {{ $t('apps.explorer.address') }}
    </span>
    <UInput
      v-model="addressInput"
      class="flex-1"
      size="sm"
      color="gray"
      variant="outline"
      spellcheck="false"
      icon="i-heroicons-folder-open"
      @keydown.enter="onEnter"
    />
  </div>
</template>
