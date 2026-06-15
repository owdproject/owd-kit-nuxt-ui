<script setup lang="ts">
defineProps({
  arrowsDisabled: { type: Boolean, required: true },
})
defineEmits([
  'back',
  'forward',
  'up',
  'cut',
  'copy',
  'paste',
  'delete',
  'properties',
])
</script>

<template>
  <div class="flex items-center space-x-1 p-2 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
    <UButton
      icon="i-heroicons-arrow-left"
      color="gray"
      variant="ghost"
      size="sm"
      :disabled="arrowsDisabled"
      @click="$emit('back')"
      :title="$t('apps.explorer.action.back')"
    />
    <UButton
      icon="i-heroicons-arrow-right"
      color="gray"
      variant="ghost"
      size="sm"
      :disabled="arrowsDisabled"
      @click="$emit('forward')"
      :title="$t('apps.explorer.action.forward')"
    />
    <UButton
      icon="i-heroicons-arrow-up-circle"
      color="gray"
      variant="ghost"
      size="sm"
      @click="$emit('up')"
      :title="$t('apps.explorer.action.up')"
    />

    <div class="border-l border-gray-200 dark:border-gray-800 h-5 mx-1" />

    <UButton
      icon="i-heroicons-scissors"
      color="gray"
      variant="ghost"
      size="sm"
      @click="$emit('cut')"
      :title="$t('apps.explorer.action.cut')"
    />
    <UButton
      icon="i-heroicons-document-duplicate"
      color="gray"
      variant="ghost"
      size="sm"
      @click="$emit('copy')"
      :title="$t('apps.explorer.action.copy')"
    />
    <UButton
      icon="i-heroicons-clipboard"
      color="gray"
      variant="ghost"
      size="sm"
      @click="$emit('paste')"
      :title="$t('apps.explorer.action.paste')"
    />
    <UButton
      icon="i-heroicons-trash"
      color="red"
      variant="ghost"
      size="sm"
      @click="$emit('delete')"
      :title="$t('apps.explorer.action.delete')"
    />

    <div class="border-l border-gray-200 dark:border-gray-800 h-5 mx-1" />

    <UButton
      icon="i-heroicons-information-circle"
      color="gray"
      variant="ghost"
      size="sm"
      @click="$emit('properties')"
      :title="$t('apps.explorer.action.properties')"
    />
  </div>
</template>
